import { productModel } from "./../models/productModel.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    subCategory: { $arrayElemAt: ["$subCategory", 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    const productId = req.params.productId;

    try {
        const products = await productModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(productId) }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] },
                    subCategory: { $arrayElemAt: ["$subCategory", 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            }
        ]);

        if (!products[0]) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Product fetched successfully",
            products: products[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
};

export const getProductBySubCategoryId = async (req, res) => {
    const subCatId = req.params.subCatId;

    try {
        const products = await productModel.aggregate([
            {
                $match: { subCategory: new mongoose.Types.ObjectId(subCatId) }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] },
                    subCategory: { $arrayElemAt: ["$subCategory", 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            },
            {
                $sort: { updatedAt: -1 }
            }
        ]);

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No products found in the given subcategory"
            });
        }

        res.status(200).send({
            success: true,
            message: "Products found in given subcategory",
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching products by subcategory",
            error: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    const {
        name, slug, shortDesc, category, subCategory,
        brand, isFeatured, status, thumbnail, attributes
    } = req.body;

    try {
        const product = new productModel({
            name,
            slug,
            shortDesc,
            category,
            subCategory,
            brand,
            isFeatured,
            status,
            thumbnail,
            attributes
        });

        await product.save();

        res.status(200).send({
            success: true,
            message: "Product has been created successfully",
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error creating product",
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    const productId = req.params.id;

    const {
        name, shortDesc, category, subCategory,
        brand, isFeatured, status, thumbnail
    } = req.body;

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        if (name) product.name = name;
        if (shortDesc) product.shortDesc = shortDesc;
        if (category) product.category = category;
        if (subCategory) product.subCategory = subCategory;
        if (brand) product.brand = brand;
        if (isFeatured !== undefined) product.isFeatured = isFeatured;
        if (status) product.status = status;
        if (thumbnail) product.thumbnail = thumbnail;

        await product.save();

        res.status(200).send({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating product",
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productModel.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error deleting product",
            error: error.message
        });
    }
};

export const getProductByCategoryId = async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const products = await productModel.aggregate([
            {
                $match: { category: new mongoose.Types.ObjectId(categoryId) }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] },
                    subCategory: { $arrayElemAt: ['$subCategory', 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            },
            {
                $sort: { updatedAt: -1 }
            }
        ]);

        if (products.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No products found for the given category"
            });
        }

        res.status(200).send({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching products by category",
            error: error.message
        });
    }
};

export const getAllProductsWithPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  // Default to page 1 and limit 10
    try {
        const products = await productModel.aggregate([
            { $skip: (page - 1) * limit },  // Skip to the correct page
            { $limit: parseInt(limit) },  // Limit the number of products
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    subCategory: { $arrayElemAt: ["$subCategory", 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products with pagination",
            error: error.message
        });
    }
};
export const searchProductsController = async (req, res) => {
    const { query } = req.query;  // Search term

    try {
        const products = await productModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: query, $options: "i" } },  // Search by name
                        { shortDesc: { $regex: query, $options: "i" } }  // Search by short description
                    ]
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    subCategory: { $arrayElemAt: ["$subCategory", 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Products found matching your search",
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching products",
            error: error.message
        });
    }
};

export const getFeaturedProductsController = async (req, res) => {
    try {
        const products = await productModel.aggregate([
            {
                $match: { isFeatured: true }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $addFields: {
                    subCategory: { $arrayElemAt: ["$subCategory", 0] }
                }
            },
            {
                $project: {
                    __v: 0,
                    category: { __v: 0, createdAt: 0, updatedAt: 0 },
                    subCategory: { __v: 0, createdAt: 0, updatedAt: 0 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Featured products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching featured products",
            error: error.message
        });
    }
};
export const deleteMultipleProductsController = async (req, res) => {
    const { ids } = req.body;  // Array of product IDs to delete

    try {
        const result = await productModel.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No products were deleted",
            });
        }

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} product(s) deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting products",
            error: error.message
        });
    }
};
