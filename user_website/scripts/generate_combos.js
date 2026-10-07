const sharp = require('../node_modules/sharp');
const path = require('path');
const fs = require('fs');

const combosDir = path.join(__dirname, '../public/combos');
const catDir = path.join(__dirname, '../public/categories');

if (!fs.existsSync(combosDir)) {
  fs.mkdirSync(combosDir, { recursive: true });
}

async function buildCombo(outputFilename, [tlFile, trFile, blFile, brFile]) {
  const size = 400;
  const half = 200;
  const itemSize = 160;
  const offset = Math.floor((half - itemSize) / 2);

  const [tl, tr, bl, br] = await Promise.all([
    sharp(path.join(catDir, tlFile)).resize(itemSize, itemSize, { fit: 'contain' }).png().toBuffer(),
    sharp(path.join(catDir, trFile)).resize(itemSize, itemSize, { fit: 'contain' }).png().toBuffer(),
    sharp(path.join(catDir, blFile)).resize(itemSize, itemSize, { fit: 'contain' }).png().toBuffer(),
    sharp(path.join(catDir, brFile)).resize(itemSize, itemSize, { fit: 'contain' }).png().toBuffer(),
  ]);

  const dividerSvg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${half}" y1="8" x2="${half}" y2="${size - 8}" stroke="#CBD5E1" stroke-width="1.8" stroke-dasharray="6,6" />
      <line x1="8" y1="${half}" x2="${size - 8}" y2="${half}" stroke="#CBD5E1" stroke-width="1.8" stroke-dasharray="6,6" />
    </svg>
  `);

  const outPath = path.join(combosDir, outputFilename);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: tl, left: offset, top: offset },
      { input: tr, left: half + offset, top: offset },
      { input: bl, left: offset, top: half + offset },
      { input: br, left: half + offset, top: half + offset },
      { input: dividerSvg, left: 0, top: 0 },
    ])
    .png()
    .toFile(outPath);

  console.log(`Generated: ${outputFilename}`);
}

async function main() {
  console.log('Generating distinct combo images...');

  // 1. PC Gamer Master Set: Keyboard + Mouse + Headset + Cables
  await buildCombo('combo-pc-gamer.png', [
    'mechanical-keyboards.svg',
    'gaming-mice.svg',
    'gaming-headsets.svg',
    'cables.svg',
  ]);

  // 2. Audio Streamer Duo: Headset + Soundbox + Cables + Fast Charger
  await buildCombo('combo-audio-duo.png', [
    'gaming-headsets.svg',
    'soundboxes.svg',
    'cables.svg',
    'fast-chargers.svg',
  ]);

  // 3. Fast Power Esports Pack: Fast Charger + Cables + Gaming Cooler + Finger Sleeves
  await buildCombo('combo-fast-power.png', [
    'fast-chargers.svg',
    'cables.svg',
    'gaming-cooler.svg',
    'finger-sleeves.svg',
  ]);

  // 4. Gamer Grooming & Lifestyle Kit: Trimmer + Soundbox + Cables + Fast Charger
  await buildCombo('combo-gamer-grooming.png', [
    'trimmers.svg',
    'soundboxes.svg',
    'fast-chargers.svg',
    'cables.svg',
  ]);

  // 5. FPS Tactical Tournament Kit: Gaming Cooler + Finger Sleeves + Fast Charger + Cables
  await buildCombo('combo-fps-tactical.png', [
    'gaming-cooler.svg',
    'finger-sleeves.svg',
    'fast-chargers.svg',
    'cables.svg',
  ]);

  // 6. Desk Setup Master: Keyboard + Mouse + Soundbox + Fast Charger
  await buildCombo('combo-desk-master.png', [
    'mechanical-keyboards.svg',
    'gaming-mice.svg',
    'soundboxes.svg',
    'fast-chargers.svg',
  ]);

  console.log('All combo images generated successfully!');
}

main().catch(console.error);
