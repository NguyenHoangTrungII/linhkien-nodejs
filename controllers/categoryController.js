const Category = require("../models/category");

const categoryController = {
  //CREATE A CATEGORY
  createCategory: async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json({ status: "success", category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //GET ALL CATEGORIES
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //GET CATEGORY BY ID
  getCategoryById: async (req, res) => {
    const categoryId = req.params.id;

    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteCategoryById: async (req, res) => {
    const categoryId = req.params.id;

    try {
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = categoryController;
