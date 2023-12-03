const express = require("express");
const brandController = require("../controllers/brandController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /brands
router.get("/", brandController.getAllBrands);

// GET /brands/:id
router.get("/:id", brandController.getBrandById);

// POST /brands
router.post("/", auth.admin, brandController.createBrand);

// DELETE /brands/:id
router.delete("/:id", auth.admin, brandController.deleteBrandById);

module.exports = router;
