import {
  blobToBase64,
  ditherFisrtPixel,
  drawQRBackground,
  getCellSize,
  getShowWithPadding,
} from '../utils';

chrome.contextMenus.create({
  id: 'imitate-image',
  title: 'Copy imitated image',
  documentUrlPatterns: ['<all_urls>'],
  contexts: ['image'],
});

getShowWithPadding().then((x) => {
  if (!x) return;

  chrome.contextMenus.create({
    id: 'imitate-image-with-padding',
    title: 'Copy imitated image with padding',
    documentUrlPatterns: ['<all_urls>'],
    contexts: ['image'],
  });
});

chrome.contextMenus.onClicked.addListener(async ({ menuItemId, srcUrl }, tab) => {
  if (!(srcUrl && tab && tab.id)) return;

  const blob = await fetch(srcUrl).then((response) => response.blob());
  const image = await createImageBitmap(blob);

  const { width, height } = image;

  const cellSize = Number(await getCellSize());

  const padding = 8 * cellSize;
  const w = width + 2 * padding;
  const h = height + 2 * padding;
  const canvas = new OffscreenCanvas(w, h);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const addPadding = menuItemId === 'imitate-image-with-padding';

  if (addPadding) drawQRBackground(canvas, cellSize);
  ctx.drawImage(image, padding, padding, width, height);
  if (!addPadding) ditherFisrtPixel(ctx);

  const imitated = await canvas.convertToBlob();

  const base64 = await blobToBase64(imitated);

  chrome.tabs.sendMessage(tab.id, { base64 });
});

declare let self: ServiceWorkerGlobalScope;

const showNotification = (message: string) => {
  if (message) {
    self.registration.showNotification(message);
  }
};

chrome.runtime.onMessage.addListener((request) => {
  showNotification(request.notification);
});
