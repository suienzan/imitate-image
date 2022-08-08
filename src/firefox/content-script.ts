import { ditherFisrtPixel } from 'src/utils';

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

chrome.runtime.onMessage.addListener(async (base64) => {
  const blob = await fetch(base64).then((response) => response.blob());
  const image = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  const { width, height } = image;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(image, 0, 0, width, height);

  ditherFisrtPixel(ctx);

  await copyCanvas(canvas);

  chrome.runtime.sendMessage({ notification: 'Copied' });
});
