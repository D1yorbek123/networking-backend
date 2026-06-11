import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Deal from '../models/Deal.js';
import User from '../models/User.js';

const monthFormatter = new Intl.DateTimeFormat('uz-UZ', { month: 'short' });

const roundMoney = (value = 0) => Math.round(value * 100) / 100;

const getMonthStart = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const buildMonthlySales = async () => {
  const now = new Date();
  const startDate = getMonthStart(new Date(now.getFullYear(), now.getMonth() - 5, 1));

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        cost: { $sum: { $multiply: [{ $ifNull: ['$product.cost', 0] }, '$items.quantity'] } },
        orders: { $addToSet: '$_id' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const match = rows.find(row => row._id.year === date.getFullYear() && row._id.month === date.getMonth() + 1);
    const revenue = match?.revenue || 0;
    const cost = match?.cost || 0;

    return {
      month: monthFormatter.format(date),
      revenue: roundMoney(revenue),
      cost: roundMoney(cost),
      profit: roundMoney(revenue - cost),
      orders: match?.orders?.length || 0,
    };
  });
};

const buildSalesByCategory = async () => {
  const rows = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$product.category', 'Boshqa'] },
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        cost: { $sum: { $multiply: [{ $ifNull: ['$product.cost', 0] }, '$items.quantity'] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return rows.map(row => ({
    category: row._id,
    quantity: row.quantity,
    revenue: roundMoney(row.revenue),
    cost: roundMoney(row.cost),
    profit: roundMoney(row.revenue - row.cost),
  }));
};

const buildOrderStatusBreakdown = async () => {
  const rows = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return rows.map(row => ({
    status: row._id,
    count: row.count,
    revenue: roundMoney(row.revenue),
  }));
};

const buildTopSellingProducts = async () => {
  const rows = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$items.product',
        name: { $first: { $ifNull: ['$product.name', 'Mahsulot'] } },
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        cost: { $sum: { $multiply: [{ $ifNull: ['$product.cost', 0] }, '$items.quantity'] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 6 },
  ]);

  return rows.map(row => ({
    name: row.name,
    quantity: row.quantity,
    revenue: roundMoney(row.revenue),
    profit: roundMoney(row.revenue - row.cost),
  }));
};

const buildInventoryByCategory = async () => {
  const rows = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        stock: { $sum: '$quantity' },
        retailValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        purchaseValue: { $sum: { $multiply: ['$cost', '$quantity'] } },
      },
    },
    { $sort: { retailValue: -1 } },
  ]);

  return rows.map(row => ({
    category: row._id || 'Boshqa',
    stock: row.stock,
    retailValue: roundMoney(row.retailValue),
    purchaseValue: roundMoney(row.purchaseValue),
  }));
};

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalCustomers,
      activeCustomers,
      totalOrders,
      revenueResult,
      totalProducts,
      lowStockProducts,
      totalDeals,
      pendingDeals,
      recentOrders,
      topCustomers,
      monthlySales,
      salesByCategory,
      orderStatusBreakdown,
      topSellingProducts,
      inventoryByCategory,
    ] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Product.countDocuments(),
      Product.countDocuments({ $expr: { $lte: ['$quantity', '$reorderLevel'] } }),
      Deal.countDocuments(),
      Deal.countDocuments({ stage: { $nin: ['closed_won', 'closed_lost'] } }),
      Order.find()
        .populate('customer', 'name company')
        .sort({ createdAt: -1 })
        .limit(5),
      Customer.find()
        .sort({ totalSpent: -1 })
        .limit(5),
      buildMonthlySales(),
      buildSalesByCategory(),
      buildOrderStatusBreakdown(),
      buildTopSellingProducts(),
      buildInventoryByCategory(),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    
    res.json({
      totalCustomers,
      activeCustomers,
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      totalDeals,
      pendingDeals,
      recentOrders,
      topCustomers,
      analytics: {
        monthlySales,
        salesByCategory,
        orderStatusBreakdown,
        topSellingProducts,
        inventoryByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userProfile = await User.findById(userId).select('-password');
    
    // Find the customer record linked to this user
    const customerRecord = await Customer.findOne({ userId });
    
    // Get the customer's orders
    let recentOrders = [];
    let totalOrders = 0;
    let totalSpent = 0;
    
    if (customerRecord) {
      recentOrders = await Order.find({ customer: customerRecord._id })
        .populate('items.product', 'name price')
        .sort({ createdAt: -1 })
        .limit(5);
      
      totalOrders = await Order.countDocuments({ customer: customerRecord._id });
      totalSpent = customerRecord.totalSpent || 0;
    }
    
    res.json({
      profile: userProfile,
      customerRecord,
      recentOrders,
      totalOrders,
      totalSpent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
