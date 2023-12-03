const Cart = require("../models/cart");
const Product = require("../models/product");

const cartController = {
  // ADD PRODUCT
  addToCart: async (req, res) => {
    try {
      const { quantity } = req.body;
      const { productId } = req.params;
      const userId = req.user._id;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        const newItem = {
          productId: product._id,
          quantity,
          price: product.price,
          name: product.name,
          thumbnail: product.thumbnail,
        };

        cart.items.push(newItem);
      }

      cart.calculateTotals();
      await cart.save();

      const populatedCart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name images",
      });

      const updatedProduct = populatedCart.items.find(
        (item) => item.productId._id.toString() === productId
      );

      res.status(200).json({ updatedProduct: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  },

  //UPDATE CART
  updateCartItem: async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      // CHECK EXIST
      const cartItem = cart.items.find(
        (item) => item._id.toString() === cartItemId
      );
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // UPDATE QUANTITY
      cartItem.quantity = quantity;

      // UPDATE TOTAL
      cart.calculateTotals();

      await cart.save();

      const populatedCart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name images",
      });

      res.status(200).json({ cart: populatedCart });
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  },

  // DELETE PRODUCT IN CART
  deleteCartItem: async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const cartItemIndex = cart.items.findIndex(
        (item) => item._id.toString() === cartItemId
      );
      if (cartItemIndex === -1) {
        return res.status(404).json({ error: cart, cartItemId });
      }

      cart.items.splice(cartItemIndex, 1);

      cart.calculateTotals();

      await cart.save();

      // const populatedCart = await Cart.findOne({ userId }).populate({
      //   path: "items.productId",
      //   select: "name images",
      // });

      res.status(200).json({ itemId: cartItemId });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cart item" });
    }
  },

  // GET CART BY USERID
  getCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name images",
      });
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Failed to get cart" });
    }
  },
};

module.exports = cartController;
