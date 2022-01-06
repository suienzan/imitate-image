import browser from 'webextension-polyfill';
import { referrerList } from './hostname';
import { getOptions } from './options';

const copyCanvas = async (canvas: HTMLCanvasElement) => {
  const imageBlob: ClipboardItemDataType = await new Promise((resolve) => {
    canvas.toBlob((data) => {
      if (!data) return;
      resolve(data);
    }, 'image/png');
  });

  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': imageBlob,
    }),
  ]);
};

const getFilename = (url: string) => (url ? url.split('/').pop()?.split('#').shift()
  ?.split('?')
  .shift() : null);

const downloadCanvas = async (canvas: HTMLCanvasElement, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
};

browser.runtime.onMessage.addListener(async (e) => {
  const { copy } = await getOptions();

  const getFetch = (url: string) => {
    const { hostname } = new URL(url);
    const hostNeedReferrer = referrerList.find((r) => r.hostname === hostname);
    return hostNeedReferrer ? fetch(e, { referrer: hostNeedReferrer.referrer }) : fetch(url);
  };

  const blob = await getFetch(e).then((response) => response.blob());

  const blobURL = window.URL.createObjectURL(blob);

  const image = new Image();
  await new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = blobURL;
  });

  const canvas = document.createElement('canvas');
  const { width, height } = image;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(image, 0, 0, width, height);

  if (copy) {
    copyCanvas(canvas);
    return;
  }

  const filename = getFilename(e);
  downloadCanvas(canvas, filename || 'filename.png');
});
