import mongoose from "mongoose";
import { subCategoryModel } from "../models/subCategoryModel.js";

export const createSubCategoryController = async (req, res) => {
  try {
    const { name, thumbnail, category } = req.body;

    // Validation check
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const subCategory = await subCategoryModel.create({ name, thumbnail, category });
    res.status(201).json({
      success: true,
      message: "subCategory created successfully",
      subCategory,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in create subCategory API",
      error: error.message,
    });
  }
};

export const deletesubCategoryController = async (req, res) => {
  try {
    const subCategory = await subCategoryModel.findByIdAndDelete(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "subCategory not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "subCategory deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in delete subCategory API",
      error: error.message,
    });
  }
}

export const getAllSubCategoryController = async (req, res) => {
  try {
    const subCategories = await subCategoryModel.find();
    res.status(200).json({
      success: true,
      message: "subCategories fetched successfully",
      subCategories,
    });

  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in get all subCategories API",
      error: error.message,
    });
  }
}

export const updateSubCategoryController = async (req, res) => {
  try {
    const { name, thumbnail, category } = req.body;

    if (!name && !thumbnail) {
      return res.status(404).json({
        success: false,
        message: "Name or thumbnail not provided ",
      });
    }
    const subcategory = await subCategoryModel.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "subcategory not found",
      });
    }

    if (name) {
      subcategory.name = name;
    }
    if (thumbnail) {
      subcategory.thumbnail = thumbnail;
    }
    if (category) {
      subcategory.category = category;
    }

    subcategory.save();
    res.status(200).json({
      success: true,
      message: "subcategory updated successfully",
      subcategory,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in update subcategory API",
      error: error.message,
    });
  }
};

export const getSubCategoryByIdController = async (req, res) => {
  try {
    const subcategory = await subCategoryModel.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "subcategory fetched successfully",
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Get subcategory by ID API",
      error: error.message,
    });
  }
};

export const searchSubCategoriesController = async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid search query",
    });
  }

  try {
    const subCategories = await subCategoryModel.find({
      name: { $regex: query, $options: 'i' },
    });

    if (subCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subcategories found matching the search term",
      });
    }

    res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching subcategories",
      error: error.message,
    });
  }
};

export const getSubCategoriesByCategoryController = async (req, res) => {
  const { categoryId } = req.params;

  try {
   
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

    const subCategories = await subCategoryModel.find({ category: categoryObjectId });

    if (!subCategories.length) {
      return res.status(404).json({
        success: false,
        message: "No subcategories found for this category",
      });
    }

    res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subcategories by category",
      error: error.message,
    });
  }
};



export const getSubCategoryCountController = async (req, res) => {
  try {
    const count = await subCategoryModel.countDocuments();
    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subcategory count",
      error: error.message,
    });
  }
};

export const deleteMultipleSubCategoriesController = async (req, res) => {
  const { ids } = req.body;

  try {
    const result = await subCategoryModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No subcategories were deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} subcategory(ies) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting subcategories",
      error: error.message,
    });
  }
};


export const updateMultipleSubCategoriesController = async (req, res) => {
  const { subCategories } = req.body;

  try {
    const updatedSubCategories = [];

    for (let subcategory of subCategories) {
      const { id, updateData } = subcategory;

      const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedSubCategory) {
        throw new Error(`Subcategory with ID ${id} not found`);
      }

      updatedSubCategories.push(updatedSubCategory);
    }

    res.status(200).json({
      success: true,
      message: `${updatedSubCategories.length} subcategory(ies) updated successfully`,
      updatedSubCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating subcategories",
      error: error.message,
    });
  }
};


