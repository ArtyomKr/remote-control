import Jimp from 'jimp';
import robot from 'robotjs';

export default async function takeScreen(
  pos: { x: number; y: number },
  size: number
) {
  const rawScreen = robot.screen.capture(
    pos.x - size / 2,
    pos.y - size / 2,
    size,
    size
  );

  for (let i = 0; i < rawScreen.image.length; i += 4) {
    if (i % 4 === 0) {
      [rawScreen.image[i], rawScreen.image[i + 2]] = [
        rawScreen.image[i + 2],
        rawScreen.image[i]
      ];
    }
  }

  const jimp = new Jimp(rawScreen.width, rawScreen.height);
  jimp.bitmap.data = rawScreen.image;

  const base64 = await jimp.getBase64Async(Jimp.MIME_PNG);
  return base64.split(',')[1];
}
