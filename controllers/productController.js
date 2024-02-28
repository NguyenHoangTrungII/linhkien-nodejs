const Product = require("../models/product");

const productController = {
  //GET ALL PRODUCT
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find({});

      res.status(200).json(products);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  setInCartStatus: async (req, res) => {
    try {
      const productId = req.body._id;
      const status = req.body.status;
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        { inCart: status },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product is nit found" });
      }

      return res.status(200).json({ product });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
};

module.exports = productController;
