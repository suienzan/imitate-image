import browser from 'webextension-polyfill';
import { getOptions } from './options';

getOptions().then(({ copy }) => {
  browser.contextMenus.create({
    id: 'imitate-image',
    title: `${copy ? 'Copy' : 'Download'} imitated image`,
    documentUrlPatterns: ['<all_urls>'],
    contexts: ['image'],
  });
});

browser.contextMenus.onClicked.addListener(({ srcUrl }, tab) => {
  if (!tab) return;
  const { id } = tab;
  if (!id) return;
  browser.tabs.sendMessage(id, srcUrl);
});
