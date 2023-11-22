const mongoose = require("mongoose");

const { Schema } = mongoose;

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  isThumbnail: {
    type: Boolean,
    default: false,
  },
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  old_price: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  images: [imageSchema],
  warranty: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status_product: {
    type: String,
    required: true,
    trim: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
