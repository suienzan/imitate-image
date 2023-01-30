import { getShowWithPadding, blobToBase64 } from '../utils';
import { hosts } from '../hosts';

const getReferrer = (url: string) => {
  const { hostname } = new URL(url);
  const hostNeedReferrer = hosts.find((r) => r.hostname === hostname);
  return hostNeedReferrer?.referrer;
};

const showNotification = (message: string) => {
  // icon is not required in Firefox
  // @ts-expect-error
  chrome.notifications.create({
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

getShowWithPadding().then((x) => {
  if (!x) return;

  chrome.contextMenus.create({
    id: 'imitate-image-with-padding',
    title: 'Copy imitated image with padding',
    documentUrlPatterns: ['<all_urls>'],
    contexts: ['image'],
  });
});

const fetchWithReferrer = (url: string) => {
  const referrer = getReferrer(url);
  return referrer ? fetch(url, { referrer }) : fetch(url);
};

const safeFetch = async (url: string) => {
  try {
    return await fetchWithReferrer(url).then((response) => response.blob());
  } catch (error) {
    if (error instanceof Error) {
      showNotification(error.message);
    }

    return undefined;
  }
};

chrome.contextMenus.onClicked.addListener(async ({ menuItemId, srcUrl }, tab) => {
  if (!(srcUrl && tab && tab.id)) return;

  const blob = await safeFetch(srcUrl);

  if (!blob) return;

  const base64 = await blobToBase64(blob);

  chrome.tabs.sendMessage(tab.id, {
    base64,
    addPadding: menuItemId === 'imitate-image-with-padding',
  });
});

chrome.runtime.onMessage.addListener((request) => {
  showNotification(request.notification);
});
