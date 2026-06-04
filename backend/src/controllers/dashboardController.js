import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Deal from '../models/Deal.js';
import User from '../models/User.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = (await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]))[0]?.total || 0;
    
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ $expr: { $lte: ['$quantity', '$reorderLevel'] } });
    
    const totalDeals = await Deal.countDocuments();
    const pendingDeals = await Deal.countDocuments({ stage: { $ne: 'closed' } });
    
    const recentOrders = await Order.find()
      .populate('customer', 'name company')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const topCustomers = await Customer.find()
      .sort({ totalSpent: -1 })
      .limit(5);
    
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // This would be implemented based on customer-specific data
    const userProfile = await User.findById(userId);
    
    res.json({
      profile: userProfile,
      message: 'Customer dashboard data',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
