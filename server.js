import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { processNewFiles } from './dropbox.js';
import fileRoutes from './routes/api/files.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/files', fileRoutes);

// Dropbox webhook endpoint
app.post('/webhook', async (req, res) => {
  console.log('📦 Dropbox webhook received:', req.body);
  res.status(200).send('OK');
  await processNewFiles();
});

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: 'dropbox-monitor',
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
