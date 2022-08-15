import { blobToBase64, ditherFisrtPixel } from '../utils';

chrome.contextMenus.create({
  id: 'imitate-image',
  title: 'Copy imitated image',
  documentUrlPatterns: ['<all_urls>'],
  contexts: ['image'],
});

chrome.contextMenus.onClicked.addListener(async ({ srcUrl }, tab) => {
  if (!(srcUrl && tab && tab.id)) return;

  const blob = await fetch(srcUrl).then((response) => response.blob());
  const image = await createImageBitmap(blob);

  const { width, height } = image;

  const offscreen = new OffscreenCanvas(width, height);
  const ctx = offscreen.getContext('2d');

  if (!ctx) return;
  ctx.drawImage(image, 0, 0, width, height);

  const seed = ditherFisrtPixel(ctx);

  const imitated = await offscreen.convertToBlob();

  const base64 = await blobToBase64(imitated);

  chrome.tabs.sendMessage(tab.id, { base64, seed });
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
