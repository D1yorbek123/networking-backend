import Order from '../models/Order.js';
import ActivityLog from '../models/ActivityLog.js';

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
    const { customer, items, totalAmount, shippingAddress, notes } = req.body;
    
    const orderNumber = `ORD-${Date.now()}`;
    
    const order = new Order({
      orderNumber, customer, items, totalAmount, shippingAddress, notes,
      createdBy: req.user.id,
    });
    
    await order.save();
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Created order: ${orderNumber}`,
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE',
      resourceType: 'order',
      resourceId: order._id,
      details: `Updated order: ${order.orderNumber}`,
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
