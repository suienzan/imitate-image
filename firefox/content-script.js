const copyCanvas = async (canvas) => {
  const imageBlob = await new Promise((resolve) => {
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

chrome.runtime.onMessage.addListener(async (base64) => {
  const blob = await fetch(base64).then((response) => response.blob());
  image = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  const { width, height } = image;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  await copyCanvas(canvas);

  chrome.runtime.sendMessage({ notification: 'Copied' });
});
