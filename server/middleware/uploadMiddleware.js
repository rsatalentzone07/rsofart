const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `rabindra-art-school/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Individual upload instances per resource so images are organised in
// separate Cloudinary folders.
const upload = {
  banner: multer({ storage: createStorage('banners'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
  gallery: multer({ storage: createStorage('gallery'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
  teacher: multer({ storage: createStorage('teachers'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
  student: multer({ storage: createStorage('students'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
};

module.exports = upload;