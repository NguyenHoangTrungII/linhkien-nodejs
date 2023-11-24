const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const uploadImage = require("../utils/uploadImage");
const uploadMiddleware = require("../utils/uploadMiddleware");
const auth = require("../middleware/auth");

//GET PRODUCT BY SEARCH NAME
router.get("/search", productController.searchProductsByName);

//GET PRODUCT BY CATEGORY
router.get("/advanced-search", productController.getProductsByFilter);

//GET /Create Product
router.post("/", auth.admin, productController.createProduct);

//GET /All Products
router.get("/", productController.getAllProduct);

//GET /Product By ID
router.get("/:id", productController.getProductById);

//GET /Product By BrandID
router.get("/brands/:brandId", productController.getProductsByBrand);

//POST / products
router.post(
  "/photo/:id",
  auth.admin,
  uploadMiddleware,
  uploadImage,
  productController.uploadProductImage
);

module.exports = router;
