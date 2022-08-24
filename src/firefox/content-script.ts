import { ditherFisrtPixel, drawQRBackground, getCellSize } from 'src/utils';

const copyCanvas = async (canvas: HTMLCanvasElement) => {
  const imageBlob: Blob = await new Promise((resolve) => {
    canvas.toBlob((data) => {
      if (!data) return;
      resolve(data);
    }, 'image/png');
  });

  if (!navigator.clipboard?.write) {
    const hint = `No ClipboardItem support.
From version 87: this feature is behind the
\`dom.events.asyncClipboard.clipboardItem\`
preferences (needs to be set to true).
To change preferences in Firefox, visit \`about:config\`.`;
    chrome.runtime.sendMessage({
      notification: hint,
    });
    return Promise.reject(hint);
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': imageBlob,
    }),
  ]);

  return Promise.resolve();
};

chrome.runtime.onMessage.addListener(async ({ base64, addPadding }) => {
  const blob = await fetch(base64).then((response) => response.blob());
  const image = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  const { width, height } = image;

  const cellSize = Number(await getCellSize());

  const padding = 8 * cellSize;
  const w = width + 2 * padding;
  const h = height + 2 * padding;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (addPadding) drawQRBackground(canvas, cellSize);
  ctx.drawImage(image, padding, padding, width, height);
  if (!addPadding) ditherFisrtPixel(ctx);

  await copyCanvas(canvas);

  chrome.runtime.sendMessage({ notification: 'Copied.' });
});
