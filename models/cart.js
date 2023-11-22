const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.calculateTotals = function () {
  const cart = this;
  let totalQuantity = 0;
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.price;
  });
  cart.totalQuantity = totalQuantity;
  cart.totalPrice = totalPrice;
};

// cartSchema.methods.getAllUserByProductId = function (productId) {
//   const cart = this;
//   let userIds = [];
//   cart.items.forEach((item) => {
//     if (item.productId.toString() === productId.toString()) {
//       userIds.push(cart.userId);
//     }
//   });
//   return userIds;
// };

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
