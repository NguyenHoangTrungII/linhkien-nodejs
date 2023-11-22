const Product = require("../models/product");
const Order = require("../models/order");

const productController = {
  // Create Product
  createProduct: async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json({ status: "success", product });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  //GET ALL PRODUCT
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find({})
        .populate("category", "name")
        .populate("brand", "name");
      res.status(200).json(products);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  //GET A PRODUCT
  getProductById: async (req, res) => {
    const _id = req.params.id;

    try {
      const product = await Product.findById(_id)
        .populate("category", "name")
        .populate("brand", "name");
      if (!product)
        return res.status(404).json({ eror: "Product does not exist" });
      return res.status(200).json(product);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  // GET PRODUCT BY BRAND
  getProductsByBrand: async (req, res) => {
    const brandId = req.params.brandId;
    try {
      const products = await Product.find({ brand: brandId })
        .populate("category", "name")
        .populate("brand", "name");
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // GET PRODUCT BY CATEGORY
  getProductsByCategory: async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
      const products = await Product.find({ category: categoryId })
        .populate("category", "name")
        .populate("brand", "name");
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getProductsByFilter: async (req, res) => {
    try {
      const { category, minPrice, maxPrice, brandId } = req.query;
      const query = {};

      if (category) {
        query.category = category;
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        query.$expr = {
          $and: [
            { $gte: [{ $toInt: "$price" }, parseInt(minPrice)] },
            { $lte: [{ $toInt: "$price" }, parseInt(maxPrice)] },
          ],
        };
      } else if (maxPrice !== undefined) {
        query.$expr = { $lte: [{ $toInt: "$price" }, parseInt(maxPrice)] };
      } else if (minPrice !== undefined) {
        query.$expr = { $gte: [{ $toInt: "$price" }, parseInt(minPrice)] };
      }

      if (brandId) {
        if (Array.isArray(brandId)) {
          query.brand = { $in: brandId };
        } else {
          query.brand = brandId;
        }
      }

      const products = await Product.find(query);

      res.status(200).json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // SEARCH PRODUCTS BY NAME
  searchProductsByName: async (req, res) => {
    const { productName, less } = req.query;

    try {
      let products;

      if (less && less.toLowerCase() === "true") {
        products = await Product.find({
          name: { $regex: productName, $options: "i" },
        })
          .limit(2)
          .populate("category", "name");
      } else {
        products = await Product.find({
          name: { $regex: productName, $options: "i" },
        }).populate("category", "name");
      }

      const response = products.map((product) => {
        const { name, _id, images, category, price } = product;
        const thumbnailImage = images.find((image) => image.isThumbnail);
        const thumbnailUrl = thumbnailImage ? thumbnailImage.url : null;
        const categoryName = category ? category.name : null;

        return { name, _id, thumbnailUrl, categoryName, price };
      });

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //UPDATE PRODUCT
  updateProductById: async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "tensp",
      "gia",
      "danhmuc",
      "thuonghieu",
      "anh",
      "baohanh",
      "nsx",
      "mota",
      "tinhtrang",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    try {
      const product = await Product.findById(_id);
      if (!product) {
        return res.status(404).json({ error: "Product does not exist" });
      }

      updates.forEach((update) => (product[update] = req.body[update]));
      await product.save();

      return res.status(200).json(product);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  //DELETE PRODUCT
  deleteProductById: async (req, res) => {
    const _id = req.params.id;
    try {
      const product = await Product.findByIdAndDelete(_id);
      return !product
        ? res.status(404).json({ error: "Product does not exists" })
        : res.status(200).json({ message: "Product deleted!" });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },

  //Upload image
  uploadProductImage: async (req, res, next) => {
    const { files } = req;
    const productId = req.params.id;

    try {
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Please upload files" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.sendStatus(404);
      }

      const images = req.images.map((image, index) => ({
        url: image.url,
        isThumbnail: index === 0,
      }));

      await product.updateOne({ $push: { images: { $each: images } } });

      res.status(201).json({ ...product._doc, images });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};

module.exports = productController;
