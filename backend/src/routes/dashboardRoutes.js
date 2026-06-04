import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { getAdminDashboard, getCustomerDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/admin', requireAdmin, getAdminDashboard);
router.get('/customer', getCustomerDashboard);

export default router;
