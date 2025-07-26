import { categoryModel } from "./../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name, thumbnail } = req.body;

    if (!name) {
      res.status(200).send({
        status: false,
        message: "Name is required",
      });
    }
    const category = await categoryModel.create({ name, thumbnail });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in create Category API",
      error: error.message,
    });
  }
};


export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in delete Category API",
      error: error.message,
    });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in Get Category by ID API",
      error: error.message,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const {name, thumbnail} = req.body;

    if (!name && !thumbnail) {
      return res.status(404).json({
        success: false,
        message: "Name or thumbnail not provided ",
      });
    }

    const category = await categoryModel.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if(name){
      category.name = name;
    }
    if(thumbnail){
      category.thumbnail = thumbnail;
    }

    await category.save();
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in Get Category by ID API",
      error: error.message,
    });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
   
    const category = await categoryModel.find();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categories not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      category
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error in Get All Categories API",
      error: error.message,
    });
  }
};

export const searchCategoriesController = async (req, res) => {
  const { query } = req.query;
  try {
    const categories = await categoryModel.find({
      name: { $regex: query, $options: "i" }, 
    });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found matching the search term",
      });
    }

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching categories",
      error: error.message,
    });
  }
};
export const countCategoriesController = async (req, res) => {
  try {
    const count = await categoryModel.countDocuments();
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category count",
      error: error.message
    });
  }
};
