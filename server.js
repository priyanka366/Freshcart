// imports
import app from "./app.js";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import express from "express";
import cookieParser from 'cookie-parser';


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productVariantRoutes from "./routes/productVariantRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/subCategory',subCategoryRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/product-variant',productVariantRoutes);
app.use('/api/v1/cart',cartRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});




