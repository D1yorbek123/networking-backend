import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
