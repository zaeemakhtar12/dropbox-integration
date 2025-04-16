// models/file.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  path: String,
  metadata: {
    rowCount: Number,
    headers: [String],
    preview: [{}]
  },
  status: {
    type: String,
    default: 'Processed'
  }
}, { timestamps: true }); // <-- adds createdAt and updatedAt

export default mongoose.model('File', fileSchema);
