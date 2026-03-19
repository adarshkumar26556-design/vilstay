const Resort = require('../models/Resort');
const Room = require('../models/Room');

const getResorts = async (req, res) => {
  try {
    const { search, city, category, sort, page = 1, limit = 12 } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (category) query.category = category;

    let sortObj = { createdAt: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'name') sortObj = { name: 1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Resort.countDocuments(query);
    const resorts = await Resort.find(query).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({ resorts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedResorts = async (req, res) => {
  try {
    const resorts = await Resort.find({ featured: true, isActive: true }).limit(6);
    res.json(resorts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort || !resort.isActive)
      return res.status(404).json({ message: 'Resort not found' });
    const rooms = await Room.find({ resort: resort._id, available: true });
    res.json({ resort, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSimilarResorts = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ message: 'Resort not found' });
    const similar = await Resort.find({
      _id: { $ne: resort._id },
      'location.state': resort.location.state,
      isActive: true,
    }).limit(3);
    res.json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResort = async (req, res) => {
  try {
    const resort = await Resort.create(req.body);
    res.status(201).json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResort = async (req, res) => {
  try {
    const resort = await Resort.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resort) return res.status(404).json({ message: 'Resort not found' });
    res.json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResort = async (req, res) => {
  try {
    const resort = await Resort.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!resort) return res.status(404).json({ message: 'Resort not found' });
    res.json({ message: 'Resort removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadResortImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const resort = await Resort.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { url: imageUrl, public_id: req.file.filename } } },
      { new: true }
    );
    res.json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResorts, getFeaturedResorts, getResortById, getSimilarResorts, createResort, updateResort, deleteResort, uploadResortImage };
