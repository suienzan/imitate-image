# Imitate image

**DO NOT USE THIS EXTENSION IF YOU DON'T EXACTLY KNOW WHAT YOU ARE DOING!**

A browser extension designed to bypass certain image hash checking systems. It recreate an image with a new hash using canvas.

NOTICE! You need to set `dom.events.asyncClipboard.clipboardItem` to `true` in `about:config` if you use Firefox and enabled the `copy` in extention option. See [ClipboardItem()](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/ClipboardItem).

## Setup

```bash
pnpm install
```

## Development

0. Add a `gecko-id.json` file at project root if you use Firefox.

   ```json
   { "id": "your id here" }
   ```

1. Generate manifest.json

   ```bash
   pnpm run manifest:firefox
   ```

   or if you use chrome

   ```bash
   pnpm run manifest:chrome
   ```

2. start dev

   watch `conten-script.ts`

   ```bash
   pnpm run dev:js
   ```

   watch `background.html and options.html`

   ```bash
   pnpm run dev:html
   ```

## Build

```bash
pnpm run build
```

## Pack

- Firefox

  Using `sign-xpi.sh` to sign for Firefox.

  Or pack unsigned xpi file

  ```bash
  pnpm run pack:xpi
  ```

- Chrome

  ```bash
  pnpm run pack:crx
  ```

## License

[MIT](LICENSE)
