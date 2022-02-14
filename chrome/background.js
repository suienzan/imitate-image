chrome.contextMenus.create({
  id: 'imitate-image',
  title: 'Copy imitated image',
  documentUrlPatterns: ['<all_urls>'],
  contexts: ['image'],
});

const blobToBase64 = (blob) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.readAsDataURL(blob);
});

chrome.contextMenus.onClicked.addListener(async ({ srcUrl }, { id }) => {
  const blob = await fetch(srcUrl).then((response) => response.blob());
  const image = await createImageBitmap(blob);

  const { width, height } = image;

  const offscreen = new OffscreenCanvas(width, height);
  const ctx = offscreen.getContext('2d');

  ctx.drawImage(image, 0, 0, width, height);

  const imitated = await offscreen.convertToBlob();

  const base64 = await blobToBase64(imitated);

  chrome.tabs.sendMessage(id, base64);
});

const showFinishedNotification = (message) => {
  if (message) {
    chrome.notifications.create({
      type: 'basic',
      title: 'Imitated image',
      iconUrl: 'icon.png',
      message,
    });
  }
};

chrome.runtime.onMessage.addListener((request) => {
  showFinishedNotification(request.notification);
});
