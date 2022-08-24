// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  const target = options.env?.target;

  return {
    entry: {
      background: `src/${target}/background.ts`,
      'content-script': `src/${target}/content-script.ts`,
      options: 'src/options.ts',
    },
    outDir: `extension/${target}`,
    clean: true,
    platform: 'browser',
    target: 'esnext',
    format: ['iife'],
    onSuccess: `pnpm manifest:${target} && cp src/options.html extension/${target}/options.html`,
  };
});
