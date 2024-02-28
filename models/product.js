const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: String,
    required: true,
    trim: true,
  },

  images: { type: String, required: true, trim: true },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  inCart: { type: Boolean, trim: true },

  color: {
    type: String,
    required: true,
    trim: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
