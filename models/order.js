const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "paid", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    modeOfPayment: {
      type: String,
      enum: ["0", "1"],
      required: true,
    },
    lastPrice: {},
  },
  {
    timestamps: true,
  }
);

orderSchema.methods.calculateTotals = function () {
  const order = this;
  let totalQuantity = 0;
  let totalPrice = 0;
  order.items.forEach((item) => {
    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.price;
  });
  order.totalQuantity = totalQuantity;
  order.totalPrice = totalPrice;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
