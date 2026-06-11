import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

const validateOrderItems = async (items, { checkStock = true } = {}) => {
  if (!items || items.length === 0) {
    throw new Error('Kamida bitta mahsulot tanlang');
  }

  let totalAmount = 0;
  const normalizedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      const error = new Error(`Mahsulot topilmadi: ${item.product}`);
      error.status = 404;
      throw error;
    }

    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      const error = new Error(`${product.name} uchun miqdor noto'g'ri`);
      error.status = 400;
      throw error;
    }

    if (checkStock && product.quantity < quantity) {
      const error = new Error(`${product.name} mahsulotidan yetarli zaxirada yo'q (zaxirada: ${product.quantity})`);
      error.status = 400;
      throw error;
    }

    normalizedItems.push({
      product: product._id,
      quantity,
      price: product.price,
    });
    totalAmount += product.price * quantity;
  }

  return {
    items: normalizedItems,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
};

const applyStockChange = async (items, direction) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: direction * item.quantity }
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    // Find the customer record linked to this user
    const customer = await Customer.findOne({ userId: req.user.id });
    
    if (!customer) {
      return res.json([]);
    }

    const orders = await Order.find({ customer: customer._id })
      .populate('items.product', 'name sku price category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const createMyOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;

    // Find the customer record linked to this user
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Sizning mijoz profilingiz topilmadi' });
    }

    const orderTotals = await validateOrderItems(items);

    const orderNumber = `ORD-${Date.now()}`;

    const order = new Order({
      orderNumber,
      customer: customer._id,
      items: orderTotals.items,
      totalAmount: orderTotals.totalAmount,
      status: 'pending',
      shippingAddress: shippingAddress || customer.address || '',
      notes: notes || '',
      createdBy: req.user.id,
    });

    await order.save();

    await applyStockChange(orderTotals.items, -1);

    // Update customer's total spent
    await Customer.findByIdAndUpdate(customer._id, {
      $inc: { totalSpent: orderTotals.totalAmount }
    });

    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Customer created order: ${orderNumber}`,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name sku price category');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const cancelMyOrder = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Sizning mijoz profilingiz topilmadi' });
    }

    const order = await Order.findOne({ _id: req.params.id, customer: customer._id });
    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: "Bu buyurtmani hozir bekor qilib bo'lmaydi" });
    }

    if (order.status !== 'cancelled') {
      await applyStockChange(order.items, 1);
      await Customer.findByIdAndUpdate(customer._id, {
        $inc: { totalSpent: -order.totalAmount }
      });
    }

    order.status = 'cancelled';
    await order.save();

    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Customer cancelled order: ${order.orderNumber}`,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name sku price category');

    res.json(populatedOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email company')
      .populate('items.product', 'name sku price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email company')
      .populate('items.product', 'name sku price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customer, items, shippingAddress, notes } = req.body;
    const customerRecord = await Customer.findById(customer);

    if (!customerRecord) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const orderTotals = await validateOrderItems(items);
    
    const orderNumber = `ORD-${Date.now()}`;
    
    const order = new Order({
      orderNumber,
      customer,
      items: orderTotals.items,
      totalAmount: orderTotals.totalAmount,
      shippingAddress,
      notes,
      createdBy: req.user.id,
    });
    
    await order.save();
    await applyStockChange(orderTotals.items, -1);

    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalSpent: orderTotals.totalAmount }
    });
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Created order: ${orderNumber}`,
    });
    
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email company')
      .populate('items.product', 'name sku price');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    const nextStatus = req.body.status || order.status;

    if (nextStatus !== previousStatus) {
      if (nextStatus === 'cancelled' && previousStatus !== 'cancelled') {
        await applyStockChange(order.items, 1);
        await Customer.findByIdAndUpdate(order.customer, {
          $inc: { totalSpent: -order.totalAmount }
        });
      }

      if (previousStatus === 'cancelled' && nextStatus !== 'cancelled') {
        await validateOrderItems(order.items, { checkStock: true });
        await applyStockChange(order.items, -1);
        await Customer.findByIdAndUpdate(order.customer, {
          $inc: { totalSpent: order.totalAmount }
        });
      }
    }

    Object.assign(order, req.body);
    await order.save();
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Updated order: ${order.orderNumber}`,
    });
    
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email company')
      .populate('items.product', 'name sku price');

    res.json(populatedOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'cancelled') {
      await applyStockChange(order.items, 1);
      await Customer.findByIdAndUpdate(order.customer, {
        $inc: { totalSpent: -order.totalAmount }
      });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'DELETE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Deleted order: ${order.orderNumber}`,
    });
    
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
