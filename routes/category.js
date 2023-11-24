const express = require("express");
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const router = express.Router();

// POST /categories
router.post("/", auth.admin, categoryController.createCategory);

// GET /categories
router.get("/", categoryController.getAllCategories);

// GET /categories/:id
router.get("/:id", categoryController.getCategoryById);

//DELETE //category
router.delete("/:id", auth.admin, categoryController.deleteCategoryById);

module.exports = router;
