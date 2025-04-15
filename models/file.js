import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now },
  metadata: Object,
});

const File = mongoose.model('File', fileSchema);

export default File;
