const referrerList = [{ hostname: 'i.pximg.net', referrer: 'https://www.pixiv.net/' }];

const getReferrer = (url) => {
  const { hostname } = new URL(url);
  const hostNeedReferrer = referrerList.find((r) => r.hostname === hostname);
  return hostNeedReferrer?.referrer;
};

const blobToBase64 = (blob) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.readAsDataURL(blob);
});

const showNotification = (message) => {
  browser.notifications.create({
    type: 'basic',
    title: 'Imitated image',
    message,
  });
};

chrome.contextMenus.create({
  id: 'imitate-image',
  title: 'Copy imitated image',
  documentUrlPatterns: ['<all_urls>'],
  contexts: ['image'],
});

chrome.contextMenus.onClicked.addListener(async ({ srcUrl }, { id }) => {
  const fetchWithReferrer = (url) => {
    const referrer = getReferrer(url);
    return referrer ? fetch(url, { referrer }) : fetch(url);
  };

  const blob = await fetchWithReferrer(srcUrl).then((response) => response.blob());
  const base64 = await blobToBase64(blob);

  chrome.tabs.sendMessage(id, base64);
});

chrome.runtime.onMessage.addListener((request) => {
  showNotification(request.notification);
});
