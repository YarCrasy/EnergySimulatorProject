/*
 Script: convert-images.js
 - Scans src/assets and src/images for .png/.jpg/.jpeg files
 - Generates a .webp version next to each original using sharp
 - Does NOT remove originals and does NOT modify code/imports
 - Usage: install sharp (npm i -D sharp) then run: node tools/convert-images.js
*/
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const roots = [
  path.resolve(process.cwd(), 'src', 'assets'),
  path.resolve(process.cwd(), 'src', 'images')
];

const exts = ['.png', '.jpg', '.jpeg'];

async function processFile(filePath) {
  try {
    const { dir, name } = path.parse(filePath);
    const outPath = path.join(dir, name + '.webp');
    // skip if webp already newer
    if (fs.existsSync(outPath)) {
      const inStat = fs.statSync(filePath);
      const outStat = fs.statSync(outPath);
      if (outStat.mtimeMs >= inStat.mtimeMs) {
        console.log('Skipping (up-to-date):', outPath);
        return;
      }
    }
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outPath);
    console.log('Created:', outPath);
  } catch (err) {
    console.error('Error processing', filePath, err.message);
  }
}

async function walkAndConvert(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      await walkAndConvert(p);
    } else {
      if (exts.includes(path.extname(it.name).toLowerCase())) {
        await processFile(p);
      }
    }
  }
}

(async function main(){
  for (const r of roots) {
    await walkAndConvert(r);
  }
  console.log('Conversion complete.');
})();
