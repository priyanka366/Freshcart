import express from 'express';
import { 
    createProductVariantController, 
    getAllProductVariantsController, 
    getProductVariantByIdController, 
    updateProductVariantController, 
    deleteProductVariantController 
} from '../controllers/productVariantController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/create', isAuth, createProductVariantController);
router.get('/get-all/:productId', isAuth, getAllProductVariantsController);
router.get('/get/:id', isAuth, getProductVariantByIdController);
router.put('/update/:id', isAuth, updateProductVariantController);
router.delete('/delete/:id', isAuth, deleteProductVariantController);
export default router;
