import express from 'express';
import File from '../../models/file.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const files = await File.find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const count = await File.countDocuments();

  res.json({
    page,
    totalPages: Math.ceil(count / limit),
    files
  });
});

router.get('/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'File not found' });
  res.json(file);
});

export default router;
