const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

const router = express.Router();

// ADD TO CART
router.post("/:productId", auth.user, cartController.addToCart);
//UPDATE QUANTITY ITEM IN CART
router.patch("/items/:cartItemId", auth.user, cartController.updateCartItem);
//DELETE ITEM IN CART
router.delete("/items/:cartItemId", auth.user, cartController.deleteCartItem);
// GET CART OF USER
router.get("/me", auth.user, cartController.getCart);

module.exports = router;
