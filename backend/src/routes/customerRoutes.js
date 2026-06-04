import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer
} from '../controllers/customerController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', requireAdmin, createCustomer);
router.put('/:id', requireAdmin, updateCustomer);
router.delete('/:id', requireAdmin, deleteCustomer);

export default router;
