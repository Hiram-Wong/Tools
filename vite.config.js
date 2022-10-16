import { defineConfig, loadEnv } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue';
import path from 'path'
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

export default defineConfig(({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      createVuePlugin(),
      vueJsx(),
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      svgLoader(),
    ],
    server: {
      port: 3000,
      host: '0.0.0.0',
    }
  }
})