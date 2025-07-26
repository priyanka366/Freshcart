import express from "express";
import { isAuth } from '../middlewares/authMiddleware.js';
import {createSubCategoryController, deletesubCategoryController, getAllSubCategoryController, getSubCategoryByIdController, updateSubCategoryController,searchSubCategoriesController, getSubCategoriesByCategoryController, getSubCategoryCountController, deleteMultipleSubCategoriesController, updateMultipleSubCategoriesController } from '../controllers/subCategoryController.js'

const router = express.Router();

router.post("/create", isAuth, createSubCategoryController);
router.delete("/delete/:id", isAuth, deletesubCategoryController);
router.get("/get-all-subCategories", isAuth, getAllSubCategoryController);
router.get("/get-subCategory-by-id/:id", isAuth, getSubCategoryByIdController);
router.put("/update/:id", isAuth, updateSubCategoryController);
router.get("/search", isAuth, searchSubCategoriesController);
router.get("/get-by-category/:categoryId", isAuth, getSubCategoriesByCategoryController);
router.get("/count", isAuth, getSubCategoryCountController);
router.delete("/delete-multiple", isAuth, deleteMultipleSubCategoriesController);
router.put("/update-multiple", isAuth, updateMultipleSubCategoriesController);


export default router;