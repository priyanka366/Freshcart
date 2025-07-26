import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  getProductByCategoryId,
  getProductBySubCategoryId,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsWithPagination,
  searchProductsController,
  getFeaturedProductsController,
  deleteMultipleProductsController
} from "../controllers/productController.js";

const router = express.Router();

router.get("/get-all-products", isAuth, getAllProducts);
router.get("/get-product-by-id/:productId", isAuth, getProductById);
router.get('/category/:categoryId', getProductByCategoryId);
router.get("/sub-category/:subCatId", isAuth, getProductBySubCategoryId);
router.post("/create", isAuth, createProduct);
router.put("/update/:id", isAuth, updateProduct);
router.delete("/delete/:id", isAuth, deleteProduct);
router.get("/get-all-products-paginated", isAuth, getAllProductsWithPagination);
router.get("/search", isAuth, searchProductsController);
router.get("/get-featured-products", isAuth, getFeaturedProductsController);
router.delete("/delete-multiple", isAuth, deleteMultipleProductsController);



export default router;
