import Customer from '../models/Customer.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('createdBy', 'name email');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('createdBy', 'name email');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, industry, address, city, country, status, creditLimit, password } = req.body;
    
    let userId = null;
    
    // Create User account so the customer can log in
    if (password) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        userId = existingUser._id;
      } else {
        const newUser = await User.create({
          name,
          email,
          password,
          role: 'customer',
          department: 'Purchasing',
        });
        userId = newUser._id;
      }
    }
    
    const customer = new Customer({
      name, email, phone, company, industry, address, city, country, status, creditLimit,
      createdBy: req.user.id,
      userId: userId,
    });
    
    await customer.save();
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE',
      resourceType: 'customer',
      resourceId: customer._id,
      details: `Created customer: ${name}`,
    });
    
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE',
      resourceType: 'customer',
      resourceId: customer._id,
      details: `Updated customer: ${customer.name}`,
    });
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'DELETE',
      resourceType: 'customer',
      resourceId: customer._id,
      details: `Deleted customer: ${customer.name}`,
    });
    
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
