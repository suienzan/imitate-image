export const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result as string);
  reader.readAsDataURL(blob);
});

const dither = (x: number) => Math.floor(x + Math.random() * 16 - 16 / 2 + 256) % 256;

type IContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export const ditherFisrtPixel = (ctx: IContext2D) => {
  const pixel = ctx.getImageData(0, 0, 1, 1);
  const {
    data: [r, g, b],
  } = pixel;

  const rgba = `rgba(${dither(r)}, ${dither(g)}, ${dither(b)}, 1)`;

  ctx.fillStyle = rgba;
  ctx.fillRect(0, 0, 1, 1);
};
