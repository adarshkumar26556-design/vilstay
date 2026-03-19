const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getResorts, getFeaturedResorts, getResortById, getSimilarResorts,
  createResort, updateResort, deleteResort, uploadResortImage,
} = require('../controllers/resortController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Multer config for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) =>
    cb(null, `resort_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getResorts);
router.get('/featured', getFeaturedResorts);
router.get('/:id', getResortById);
router.get('/:id/similar', getSimilarResorts);
router.post('/', protect, admin, createResort);
router.put('/:id', protect, admin, updateResort);
router.delete('/:id', protect, admin, deleteResort);
router.post('/:id/upload', protect, admin, upload.single('image'), uploadResortImage);

module.exports = router;
