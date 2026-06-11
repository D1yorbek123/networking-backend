import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllDeals, getDealById, createDeal, updateDeal, deleteDeal
} from '../controllers/dealController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', requireAdmin, getAllDeals);
router.get('/:id', requireAdmin, getDealById);
router.post('/', requireAdmin, createDeal);
router.put('/:id', requireAdmin, updateDeal);
router.delete('/:id', requireAdmin, deleteDeal);

export default router;
