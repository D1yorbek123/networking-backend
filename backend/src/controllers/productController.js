import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, price, cost, quantity, reorderLevel, warehouse } = req.body;
    
    const product = new Product({
      name, sku, category, price, cost, quantity, reorderLevel, warehouse,
    });
    
    await product.save();
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE',
      resourceType: 'product',
      resourceId: product._id,
      details: `Created product: ${name}`,
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE',
      resourceType: 'product',
      resourceId: product._id,
      details: `Updated product: ${product.name}`,
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'DELETE',
      resourceType: 'product',
      resourceId: product._id,
      details: `Deleted product: ${product.name}`,
    });
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
