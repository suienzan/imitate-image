chrome.runtime.onMessage.addListener(async ({ base64 }) => {
  const imageBlob = await fetch(base64).then((response) => response.blob());

  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': imageBlob,
    }),
  ]);

  chrome.runtime.sendMessage({ notification: 'Copied.' });
});
