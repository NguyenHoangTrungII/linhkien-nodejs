const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configuration 
cloudinary.config({
  cloud_name: 'dew9jv3hy',
  api_key: '129853844153476',
  api_secret: 'DLUHWDmkEBqZDgSowlHU2f6PI-s'
});

// Middleware function to upload image and return URL
function uploadImage(req, res, next) {
  const files = req.files; // assume req.files contains the array of image files
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No images provided' });
  }

  const folder = req.body.folder || 'product-cloud'; // Get the folder name from the request body or use 'product-cloud' as the default folder

  // Array to store uploaded images
  const uploadedImages = [];

  // Function to upload each image file to Cloudinary
  const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, { folder }, (error, result) => {
        if (error) {
          console.log(error);
          reject(new Error('Error uploading image to Cloudinary'));
        } else {
          const newImage = {
            url: result.secure_url,
            isThumbnail: false,
          };
          uploadedImages.push(newImage);
          fs.unlinkSync(file.path); // Remove the uploaded file from the server
          resolve();
        }
      });
    });
  };

  // Array of promises for uploading images
  const uploadPromises = files.map((file) => uploadImageToCloudinary(file));

  // Execute all upload promises
  Promise.all(uploadPromises)
    .then(() => {
      req.images = uploadedImages; // Assign the uploaded images to the request object
      next();
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: error.message });
    });
}

module.exports = uploadImage;
