const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");

// Configuration for Cloudinary
// cloudinary.config({
//   cloud_name: "dew9jv3hy",
//   api_key: "129853844153476",
//   api_secret: "DLUHWDmkEBqZDgSowlHU2f6PI-s",
// });

// import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: "dtdpz7tk5",
  api_key: "634851463263782",
  api_secret: "16v14uvQ1D4eMfJnQRYK_z2YYRg",
});

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/admin/Pictures"); // Temporary folder to store files before uploading to Cloudinary
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Set up Multer upload object for a single file (avatar)
const upload = multer({ storage: storage }).single("avatar");

// Middleware function to upload avatar to Cloudinary and return URL
function uploadAvatarToCloudinary(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "Multer error occurred" });
    } else if (err) {
      return res
        .status(500)
        .json({ error: "An unexpected error occurred", err });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No avatar provided" });
    }

    const folder = req.body.folder || "avatars";

    // Function to upload the avatar file to Cloudinary using upload_stream
    const uploadAvatarToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) {
              console.log(error);
              reject(new Error("Error uploading avatar to Cloudinary"));
            } else {
              const avatarUrl = result.secure_url;
              fs.unlinkSync(file.path); // Remove the uploaded file from the server
              req.avatarUrl = avatarUrl;
              resolve();
            }
          }
        );

        fs.createReadStream(file.path).pipe(uploadStream); // Pipe the file buffer to Cloudinary upload stream
      });
    };

    // Execute the upload promise
    uploadAvatarToCloudinary()
      .then(() => {
        next();
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: error.message });
      });
  });
}

module.exports = uploadAvatarToCloudinary;
