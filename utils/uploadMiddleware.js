const multer = require('multer');

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Set up multer upload object
const upload = multer({ storage: storage });

// Define middleware function to handle file uploads
const uploadMiddleware = upload.array('files', 5); // 'files' is the name of the field in the request to upload multiple images, 5 is the maximum number of files allowed

module.exports = uploadMiddleware;
