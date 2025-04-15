import express from 'express';
import File from '../../models/file.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || '';

  const skip = (page - 1) * limit;

  const searchQuery = search
    ? {
        name: { $regex: search, $options: 'i' }, // case-insensitive search
      }
    : {};

  try {
    const totalFiles = await File.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalFiles / limit);

    const files = await File.find(searchQuery)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages,
      files,
    });
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

export default router;
