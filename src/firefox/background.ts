import { blobToBase64 } from '../utils';
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

chrome.contextMenus.onClicked.addListener(async ({ srcUrl }, tab) => {
  if (!(srcUrl && tab && tab.id)) return;

  const fetchWithReferrer = (url: string) => {
    const referrer = getReferrer(url);
    return referrer ? fetch(url, { referrer }) : fetch(url);
  };

  const blob = await fetchWithReferrer(srcUrl).then((response) => response.blob());
  const base64 = await blobToBase64(blob);

  chrome.tabs.sendMessage(tab.id, base64);
});

chrome.runtime.onMessage.addListener((request) => {
  showNotification(request.notification);
});
