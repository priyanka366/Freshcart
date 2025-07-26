import express from "express";
import { isAuth } from '../middlewares/authMiddleware.js';
import {createCategoryController, deleteCategoryController, getCategoryByIdController, updateCategoryController, getAllCategoriesController, searchCategoriesController, countCategoriesController} from './../controllers/categoryController.js';
const router = express.Router();

router.post("/create", isAuth, createCategoryController);

router.delete("/delete/:id", isAuth, deleteCategoryController);

router.get("/get-category-by-id/:id", isAuth, getCategoryByIdController);

router.put("/update/:id", isAuth, updateCategoryController);

router.get("/get-all", isAuth, getAllCategoriesController);

router.get("/search", isAuth, searchCategoriesController);

router.get("/count", isAuth, countCategoriesController);


export default router;