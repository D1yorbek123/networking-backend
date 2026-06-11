import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder,
  getMyOrders, createMyOrder, cancelMyOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.use(verifyToken);

// Customer-specific routes (must be before /:id routes)
router.get('/my', getMyOrders);
router.post('/my', createMyOrder);
router.put('/my/:id/cancel', cancelMyOrder);

router.get('/', requireAdmin, getAllOrders);
router.get('/:id', requireAdmin, getOrderById);
router.post('/', requireAdmin, createOrder);
router.put('/:id', requireAdmin, updateOrder);
router.delete('/:id', requireAdmin, deleteOrder);

export default router;
