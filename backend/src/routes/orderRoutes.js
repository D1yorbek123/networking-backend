import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', requireAdmin, createOrder);
router.put('/:id', requireAdmin, updateOrder);
router.delete('/:id', requireAdmin, deleteOrder);

export default router;
