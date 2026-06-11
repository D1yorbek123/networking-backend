import Deal from '../models/Deal.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find()
      .populate('customer', 'name email company')
      .populate('assignedTo', 'name email');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('customer', 'name email company')
      .populate('assignedTo', 'name email');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDeal = async (req, res) => {
  try {
    const { title, name, customer, value, stage, probability, expectedCloseDate, assignedTo } = req.body;
    
    const dealName = title || name;
    
    const deal = new Deal({
      name: dealName, customer, value, stage, probability, expectedCloseDate, assignedTo,
    });
    
    await deal.save();
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE',
      resourceType: 'deal',
      resourceId: deal._id,
      details: `Created deal: ${name}`,
    });
    
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeal = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.title) {
      updateData.name = updateData.title;
      delete updateData.title;
    }
    
    const deal = await Deal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE',
      resourceType: 'deal',
      resourceId: deal._id,
      details: `Updated deal: ${deal.name}`,
    });
    
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'DELETE',
      resourceType: 'deal',
      resourceId: deal._id,
      details: `Deleted deal: ${deal.name}`,
    });
    
    res.json({ message: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
