import { ProductVariant } from "../models/productVariantModel.js";
import { productModel } from "../models/productModel.js";
// Create a new product variant
export const createProductVariantController = async (req, res) => {
  const { product, color, size, weight, stock, price, thumbnail, photos } = req.body;

  try {
    const newProductVariant = new ProductVariant({
      product,
      color,
      size,
      weight,
      stock,
      price,
      thumbnail,
      photos
    });

    await newProductVariant.save();

     // Update the product to add the variant ID to its variants array
     await productModel.findByIdAndUpdate(
      product, // The product ID
      { $push: { variants: newProductVariant._id } }, // Push the variant ID to the variants array
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Product variant created successfully.",
      productVariant: newProductVariant
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating product variant",
      error: error.message
    });
  }
};

// Get all variants for a specific product
export const getAllProductVariantsController = async (req, res) => {
  const { productId } = req.params;

  try {
    const variants = await ProductVariant.find({ product: productId });

    if (variants.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No variants found for this product."
      });
    }

    res.status(200).send({
      success: true,
      message: "Product variants fetched successfully.",
      variants
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching product variants",
      error: error.message
    });
  }
};

// Get a specific product variant by its ID
export const getProductVariantByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const variant = await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).send({
        success: false,
        message: "Product variant not found."
      });
    }

    res.status(200).send({
      success: true,
      message: "Product variant fetched successfully.",
      variant
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching product variant",
      error: error.message
    });
  }
};

// Update a product variant
export const updateProductVariantController = async (req, res) => {
  const { id } = req.params;
  const { color, size, weight, stock, price, thumbnail, photos } = req.body;

  try {
    const variant = await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).send({
        success: false,
        message: "Product variant not found."
      });
    }

    // Update fields if provided
    if (color) variant.color = color;
    if (size) variant.size = size;
    if (weight) variant.weight = weight;
    if (stock) variant.stock = stock;
    if (price) variant.price = price;
    if (thumbnail) variant.thumbnail = thumbnail;
    if (photos) variant.photos = photos;

    await variant.save();

    res.status(200).send({
      success: true,
      message: "Product variant updated successfully.",
      variant
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating product variant",
      error: error.message
    });
  }
};

// Delete a product variant by its ID
export const deleteProductVariantController = async (req, res) => {
  const { id } = req.params;

  try {
    const variant = await ProductVariant.findByIdAndDelete(id);

    if (!variant) {
      return res.status(404).send({
        success: false,
        message: "Product variant not found."
      });
    }

    res.status(200).send({
      success: true,
      message: "Product variant deleted successfully."
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting product variant",
      error: error.message
    });
  }
};
