import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const DEMO_USERS = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
  },
  {
    name: 'John Smith',
    email: 'john@company1.com',
    password: 'password123',
    role: 'customer',
    department: 'Purchasing',
  },
];

const DEMO_PRODUCTS = [
  {
    name: 'Classic Cotton Shirt',
    sku: 'DEMO-SHIRT-001',
    category: 'Shirts',
    price: 32,
    cost: 14,
    quantity: 60,
    reorderLevel: 12,
  },
  {
    name: 'Urban Denim Pants',
    sku: 'DEMO-PANTS-001',
    category: 'Pants',
    price: 54,
    cost: 25,
    quantity: 44,
    reorderLevel: 10,
  },
  {
    name: 'Evening Midi Dress',
    sku: 'DEMO-DRESS-001',
    category: 'Dresses',
    price: 76,
    cost: 35,
    quantity: 35,
    reorderLevel: 8,
  },
  {
    name: 'Minimal Leather Belt',
    sku: 'DEMO-ACC-001',
    category: 'Accessories',
    price: 22,
    cost: 8,
    quantity: 80,
    reorderLevel: 15,
  },
];

const DEMO_ORDERS = [
  {
    orderNumber: 'DEMO-ORD-001',
    status: 'delivered',
    monthOffset: -2,
    items: [
      { sku: 'DEMO-SHIRT-001', quantity: 4 },
      { sku: 'DEMO-PANTS-001', quantity: 2 },
    ],
  },
  {
    orderNumber: 'DEMO-ORD-002',
    status: 'processing',
    monthOffset: -1,
    items: [
      { sku: 'DEMO-DRESS-001', quantity: 3 },
      { sku: 'DEMO-ACC-001', quantity: 6 },
    ],
  },
  {
    orderNumber: 'DEMO-ORD-003',
    status: 'shipped',
    monthOffset: 0,
    items: [
      { sku: 'DEMO-SHIRT-001', quantity: 5 },
      { sku: 'DEMO-ACC-001', quantity: 8 },
    ],
  },
];

const ensureDemoProducts = async () => {
  const productsBySku = new Map();

  for (const item of DEMO_PRODUCTS) {
    let product = await Product.findOne({ sku: item.sku });

    if (!product) {
      product = await Product.create(item);
    } else {
      product.name = item.name;
      product.category = item.category;
      product.price = item.price;
      product.cost = item.cost;
      product.reorderLevel = item.reorderLevel;
      product.status = 'active';
      if (product.quantity < item.reorderLevel) {
        product.quantity = item.quantity;
      }
      await product.save();
    }

    productsBySku.set(item.sku, product);
  }

  return productsBySku;
};

const ensureDemoOrders = async ({ admin, customer, productsBySku }) => {
  for (const item of DEMO_ORDERS) {
    const existingOrder = await Order.findOne({ orderNumber: item.orderNumber });
    if (existingOrder) continue;

    const orderDate = new Date();
    orderDate.setMonth(orderDate.getMonth() + item.monthOffset);

    const orderItems = item.items.map(orderItem => {
      const product = productsBySku.get(orderItem.sku);
      return {
        product: product._id,
        quantity: orderItem.quantity,
        price: product.price,
      };
    });

    const totalAmount = orderItems.reduce((sum, orderItem) => sum + orderItem.price * orderItem.quantity, 0);

    await Order.create({
      orderNumber: item.orderNumber,
      customer: customer._id,
      items: orderItems,
      totalAmount,
      status: item.status,
      shippingAddress: customer.address || 'Demo delivery address',
      notes: 'Demo analytics order',
      createdBy: admin._id,
      createdAt: orderDate,
      updatedAt: orderDate,
    });

    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(orderItem.product, {
        $inc: { quantity: -orderItem.quantity },
      });
    }
  }

  const totals = await Order.aggregate([
    { $match: { customer: customer._id, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } },
  ]);

  customer.totalSpent = totals[0]?.totalSpent || 0;
  await customer.save();
};

export const ensureDemoAccounts = async () => {
  if (process.env.ENABLE_DEMO_ACCOUNTS !== 'true') {
    return;
  }

  let adminUser = null;
  let customerRecord = null;

  for (const demoUser of DEMO_USERS) {
    let user = await User.findOne({ email: demoUser.email });

    if (!user) {
      user = await User.create(demoUser);
    } else {
      user.name = demoUser.name;
      user.role = demoUser.role;
      user.department = demoUser.department;
      user.password = demoUser.password;
      await user.save();
    }

    if (demoUser.role === 'admin') {
      adminUser = user;
    }

    if (demoUser.role === 'customer') {
      const customer = await Customer.findOne({ userId: user._id }) || await Customer.findOne({ email: demoUser.email });

      if (customer) {
        customer.userId = user._id;
        customer.name = customer.name || demoUser.name;
        customer.email = customer.email || demoUser.email;
        customer.company = customer.company || 'Fashion Retail Inc';
        customer.status = 'active';
        await customer.save();
        customerRecord = customer;
      } else {
        customerRecord = await Customer.create({
          name: demoUser.name,
          email: demoUser.email,
          company: 'Fashion Retail Inc',
          industry: 'Retail',
          status: 'active',
          userId: user._id,
        });
      }
    }
  }

  if (adminUser && customerRecord) {
    const productsBySku = await ensureDemoProducts();
    await ensureDemoOrders({ admin: adminUser, customer: customerRecord, productsBySku });
  }

  console.log('[v0] Demo accounts are ready');
};
