const Brand = require("../models/brand");

const brandController = {
  //CREATE BRAND
  createBrand: async (req, res) => {
    try {
      const brand = new Brand(req.body);
      await brand.save();
      res.status(201).json({ status: "success", brand });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //GET ALL BRANDS
  getAllBrands: async (req, res) => {
    try {
      const brands = await Brand.find({});
      res.status(200).json(brands);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //GET BRAND BY ID
  getBrandById: async (req, res) => {
    const brandId = req.params.id;

    try {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.status(200).json(brand);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //DELETE BRAND BY ID
  deleteBrandById: async (req, res) => {
    const brandId = req.params.id;

    try {
      const brand = await Brand.findByIdAndDelete(brandId);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      res.status(200).json({ message: "Brand deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = brandController;
