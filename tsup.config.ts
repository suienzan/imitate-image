// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  const { target } = options.env;

  return {
    entry: [`src/${target}/background.ts`, `src/${target}/content-script.ts`],
    outDir: `extension/${target}`,
    clean: true,
    platform: 'browser',
    target: 'esnext',
    format: ['esm'],
    onSuccess: `pnpm manifest:${target}`,
  };
});
