const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// POST /categories
router.post("/", categoryController.createCategory);

// GET /categories
router.get("/", categoryController.getAllCategories);

// GET /categories/:id
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
