import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';  // Ensure the user is authenticated
import {
  addItemToCartController,
  getCartController,
  updateItemQuantityInCartController,
  removeItemFromCartController,
  clearCartController
} from '../controllers/cartController.js';

const router = express.Router();
router.post('/add-item', isAuth, addItemToCartController);
router.get('/get-cart', isAuth, getCartController);
router.put('/update-quantity', isAuth, updateItemQuantityInCartController);
router.delete('/remove-item', isAuth, removeItemFromCartController);
router.delete('/clear-cart', isAuth, clearCartController);

export default router;
