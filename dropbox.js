// dropbox.js
import fs from 'fs-extra';
import path from 'path';
import { Dropbox } from 'dropbox';
import dotenv from 'dotenv';
import File from './models/file.js';
import fetch from 'node-fetch';

dotenv.config();

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch,
});

const downloadFolder = path.join(process.cwd(), 'downloads');

export async function processNewFiles() {
  const folderPath = process.env.WATCH_FOLDER_PATH;

  console.log(`🔍 Checking Dropbox folder: ${folderPath}`);

  try {
    const response = await dbx.filesListFolder({ path: '/uploads' });


    for (const entry of response.result.entries) {
      if (entry['.tag'] === 'file' && entry.name.endsWith('.csv')) {
        const localPath = path.join(downloadFolder, entry.name);

        const alreadyExists = await File.findOne({ path: entry.path_lower });
        if (alreadyExists) {
          console.log(`⏭️ Already downloaded: ${entry.name}`);
          continue;
        }

        console.log(`⬇️ Downloading: ${entry.name}`);

        const { result } = await dbx.filesDownload({ path: entry.path_lower });

        fs.ensureDirSync(downloadFolder);
        fs.writeFileSync(localPath, result.fileBinary, 'binary');

        const fileDoc = new File({
          name: entry.name,
          path: entry.path_lower,
          metadata: {}, // you can fill this with parsed CSV data later
        });

        await fileDoc.save();

        console.log(`✅ Saved file: ${entry.name}`);
      }
    }
  } catch (err) {
    console.error('❌ Error processing Dropbox files:', err);
  }
}
