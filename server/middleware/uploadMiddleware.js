const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createStorage = (folder, maxWidth = 1200) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `rabindra-art-school/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        // Auto quality + format (webp/avif where supported) AND resize to max width
        { quality: 'auto', fetch_format: 'auto', width: maxWidth, crop: 'limit' },
      ],
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = {
  // Banners: wider (hero images)
  banner:  multer({ storage: createStorage('banners', 1600),  fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
  // Gallery: standard width
  gallery: multer({ storage: createStorage('gallery', 1200),  fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
  // Profile photos: smaller
  teacher: multer({ storage: createStorage('teachers', 800),  fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
  student: multer({ storage: createStorage('students', 800),  fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
};

module.exports = upload;
