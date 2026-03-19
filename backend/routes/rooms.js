const express = require('express');
const router = express.Router();
const {
  getRoomsByResort, getRoomById, checkAvailability,
  createRoom, updateRoom, deleteRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/resort/:resortId', getRoomsByResort);
router.get('/availability', checkAvailability);
router.get('/:id', getRoomById);
router.post('/', protect, admin, createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
