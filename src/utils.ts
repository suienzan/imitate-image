export const DEFAULT_CELL_SIZE = '6';
export const DEFAULT_SHOW_WITH_PADDING = true;

export const getStorage = <T>(key: string, defaultValue: T) => new Promise<T>((resolve) => {
  chrome.storage.sync.get(key, (items) => {
    resolve(items[key] || defaultValue);
  });
});

export const getCellSize = () => getStorage('cellSize', DEFAULT_CELL_SIZE);
export const getShowWithPadding = () => getStorage('showWithPadding', DEFAULT_SHOW_WITH_PADDING);

export const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result as string);
  reader.readAsDataURL(blob);
});

// eslint-disable-next-line no-nested-ternary
const ditherRangeStart = (x: number) => (x < 8 ? 0 : x > 255 - 7 ? 255 - 15 : x - 7);

export const dither = (x: number) => ditherRangeStart(x) + Math.floor(Math.random() * 16);

type IContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export const ditherFisrtPixel = (ctx: IContext2D) => {
  const pixel = ctx.getImageData(0, 0, 1, 1);
  const {
    data: [r, g, b],
  } = pixel;

  const rgb = [dither(r), dither(g), dither(b)];

  const rgba = `rgba(${rgb.join(',')}, 1)`;

  ctx.fillStyle = rgba;
  ctx.fillRect(0, 0, 1, 1);

  const hex = rgb
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return hex;
};

const getRandomColor = () => (Math.random() > 0.5 ? 'white' : 'black');

export const align = (size: number) => (x: number) => Math.ceil(x / size) * size;

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

const drawDot = (ctx: Context2D, step: number) => ([x, y]: number[]) => {
  ctx.fillStyle = getRandomColor();
  ctx.fillRect(x * step, y * step, step, step);
};

const drawCorner = (ctx: Context2D, step: number) => (x: number, y: number) => {
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, step * 9, step * 9);
  ctx.fillStyle = 'black';
  ctx.fillRect(x + step, y + step, step * 7, step * 7);
  ctx.fillStyle = 'white';
  ctx.fillRect(x + 2 * step, y + 2 * step, step * 5, step * 5);
  ctx.fillStyle = 'black';
  ctx.fillRect(x + 3 * step, y + 3 * step, step * 3, step * 3);
};

export const drawQRBackground = (canvas: HTMLCanvasElement | OffscreenCanvas, step: number) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;

  const w = Math.ceil(width / step);
  const h = Math.ceil(height / step);
  const matrix = [...Array(w)].flatMap((_, x) => [...Array(h)].map((__, y) => [x, y]));

  matrix.forEach(drawDot(ctx, step));

  const drawCtxCorner = drawCorner(ctx, step);

  drawCtxCorner(-step, -step);
  drawCtxCorner(-step, height - 8 * step);
  drawCtxCorner(width - 8 * step, -step);
};
