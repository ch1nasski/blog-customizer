import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { basename } from 'node:path/posix';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const SERVER_PORT = 8080;
const HASH_LENGTH = 5;

// Формат имени: ArrowButton-module__container_a1b2c
const getScopedClassName = (className: string, filename: string): string => {
  const [filePath] = filename.replace(/\\/g, '/').split('?');
  const fileName = basename(filePath).replace(/\.\w+$/, '').replace('.module', '-module');
  const hash = createHash('sha256')
    .update(`${filePath}-${className}`)
    .digest('hex')
    .slice(0, HASH_LENGTH);

  return `${fileName}__${className}_${hash}`;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  base: '',
  css: {
    modules: {
      generateScopedName: getScopedClassName,
    },
    preprocessorOptions: {
      scss: {
        // @ts-expect-error api is a valid sass option but not in Vite's types yet
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: SERVER_PORT,
    open: true,
  },
});
