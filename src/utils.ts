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
