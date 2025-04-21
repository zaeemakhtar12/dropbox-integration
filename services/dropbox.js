import fs from 'fs-extra';
import path from 'path';
import { Dropbox } from 'dropbox';
import dotenv from 'dotenv';
import File from '../models/file.js';
import csvParser from 'csv-parser';
import fetch from 'node-fetch';

dotenv.config();

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch });
const downloadFolder = path.join(process.cwd(), 'downloads');
const previewLimit = parseInt(process.env.PREVIEW_LIMIT || '5');

export async function processNewFiles() {
  const folderPath = process.env.WATCH_FOLDER_PATH || '/uploads';

  try {
    const response = await dbx.filesListFolder({ path: folderPath });

    for (const entry of response.result.entries) {
      if (entry['.tag'] === 'file' && entry.name.endsWith('.csv')) {
        const localPath = path.join(downloadFolder, entry.name);

        const alreadyExists = await File.findOne({ path: entry.path_lower });
        if (alreadyExists) {
          console.log(`⚠️ File already processed: ${entry.name}`);
          continue;
        }

        const { result } = await dbx.filesDownload({ path: entry.path_lower });
        fs.ensureDirSync(downloadFolder);
        fs.writeFileSync(localPath, result.fileBinary, 'binary');

        const rows = [];
        const headers = new Set();
        const preview = [];

        await new Promise((resolve, reject) => {
          fs.createReadStream(localPath)
            .pipe(csvParser())
            .on('data', (row) => {
              rows.push(row);
              Object.keys(row).forEach((key) => headers.add(key));
              if (preview.length < previewLimit) preview.push(row);
            })
            .on('end', resolve)
            .on('error', reject);
        });

        const fileDoc = new File({
          name: entry.name,
          path: entry.path_lower,
          metadata: {
            rowCount: rows.length,
            headers: Array.from(headers),
            preview,
          },
          status: 'Processed',
        });

        await fileDoc.save();
        console.log(`✅ Processed & saved file: ${entry.name}`);
      }
    }
  } catch (err) {
    console.error('❌ Error processing Dropbox files:', err);
  }
}
