const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const router = express.Router();

//POST /orders
router.post("/", auth.user, orderController.createOrder);

//GET /orders
router.get("/", auth.user, orderController.getAllOrders);

//PATCH /orders
router.patch("/:orderId", auth.user, orderController.cancelOrder);

module.exports = router;
