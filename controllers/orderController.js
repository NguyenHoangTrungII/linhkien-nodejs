const Cart = require("../models/cart");
const Order = require("../models/order");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { shippingAddress, modeOfPayment } = req.body;

      const cart = await Cart.findOne({ userId }).populate(
        "items.productId",
        "name images"
      );

      if (!cart) {
        return res
          .status(400)
          .json({ error: "Giỏ hàng của bạn hiện đang trống." });
      }

      const orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        name: item.productId.name,
        thumbnail: item.productId.images.find((image) => image.isThumbnail).url,
      }));

      const order = new Order({
        userId,
        items: orderItems,
        shippingAddress,
        modeOfPayment,
      });

      order.calculateTotals();

      if (modeOfPayment === "0") {
        order.lastPrice = 0;
        order.status = "paid";
      } else if (modeOfPayment === "1") {
        order.lastPrice = order.totalPrice + 50000;
      }

      await order.save();

      await Cart.findOneAndRemove({ userId });

      res
        .status(201)
        .json({ message: "Đơn hàng đã được đặt thành công.", order });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi trong quá trình đặt hàng." });
    }
  },

  createOrderAdvanced: async (req, res) => {
    try {
      const userId = req.user.id;
      const { shippingAddress, modeOfPayment } = req.body;

      const cart = await Cart.findOne({ userId }).populate(
        "items.productId",
        "name images"
      );

      if (!cart) {
        return res
          .status(400)
          .json({ error: "Giỏ hàng của bạn hiện đang trống." });
      }

      const orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        name: item.productId.name,
        thumbnail: item.productId.images.find((image) => image.isThumbnail).url,
      }));

      const order = new Order({
        userId,
        items: orderItems,
        shippingAddress,
        modeOfPayment,
      });

      order.calculateTotals();

      if (modeOfPayment === "0") {
        order.lastPrice = 0;
        order.status = "paid";
      } else if (modeOfPayment === "1") {
        order.lastPrice = order.totalPrice + 50000;
      }

      await order.save();

      await Cart.findOneAndRemove({ userId });

      res
        .status(201)
        .json({ message: "Đơn hàng đã được đặt thành công.", order });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi trong quá trình đặt hàng." });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find();

      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi trong quá trình lấy đơn hàng." });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: "Đơn hàng không tồn tại." });
      }

      if (order.status === "completed") {
        return res
          .status(400)
          .json({ error: "Không thể hủy đơn hàng đã hoàn thành." });
      }

      order.status = "cancelled";
      await order.save();

      res.status(200).json({ message: "Đơn hàng đã được hủy thành công." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi trong quá trình hủy đơn hàng." });
    }
  },
};

module.exports = orderController;
