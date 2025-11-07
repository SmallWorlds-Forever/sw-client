import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
const Path = require('path');
import { resolve } from 'path';
const userAgent = process.env.VITE_USER_AGENT || 'YOUR_CUSTOM_AGENT';
import vueDevTools from 'vite-plugin-vue-devtools';
//use dotenvx
// import dotenv from '@dotenvx/dotenvx';
// dotenv.config();
const baseUrl = process.env.VITE_DEFAULT_URL;


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    vueDevTools(),
  ],
  build: {
    // chunkSizeWarningLimit: 1600,
    outDir: Path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
  },
  open: false,
  root: Path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  // use rollupoptions
  // rollupInputOptions: {

  // pluginOptions: {
  //   electronBuilder: {
  //     preload : 'src/preload.js',
  //   },
  // },
  // proxy
  server: {
    port: 8080,
    strictPort: true,
    host: 'localhost.charlesproxy.com',
    hmr:
    {
      protocol: 'ws',
      host: 'localhost',
    },
    watch: {
      usePolling: true,
      additionalPaths:(watcher) => 
      {
        watcher.add(path.resolve(__dirname, '**'));
      },
    },
    proxy: {
      // '/': {
      //   target: baseUrl,
      //   changeOrigin: true,
      //   // use custom userAgent
      //   headers: {
      //     'User-Agent': userAgent,
      //   },
      // },
      '/api': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'User-Agent': userAgent,
        },
      },
      '/space': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/space/, ''),
        headers: {
          'User-Agent': userAgent,
        },
      },
    },
  },
  define: { 'process.env': {},
  global: {},
},
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/renderer'),
      '@components': resolve(__dirname, './src/renderer/components'),
      '@stores': resolve(__dirname, './src/renderer/stores'),
      '@assets': resolve(__dirname, './src/renderer/public'),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
});