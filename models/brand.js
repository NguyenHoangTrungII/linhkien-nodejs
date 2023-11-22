const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // Các trường khác mà bạn cần
    },
    { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
