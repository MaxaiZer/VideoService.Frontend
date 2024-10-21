import { defineConfig, loadEnv } from 'vite';
//import vitePluginRequire from "vite-plugin-require";
import { resolve } from 'path';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return {
   // plugins: [vitePluginRequire.default()],
    root: 'src',
    publicDir: '../public',
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
    },
 //   optimizeDeps: {
  //    include: ['video.js','videojs-hls-quality-selector'],
 //   },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          main: 'src/pages/index.html',
          header: resolve(__dirname, 'src/pages/header.html'),
          uploadVideo: resolve(__dirname, 'src/pages/upload_video.html'),
          profile: resolve(__dirname, 'src/pages/profile.html'),
          login: resolve(__dirname, 'src/pages/login.html'),
          register: resolve(__dirname, 'src/pages/register.html'),
          video: resolve(__dirname, 'src/pages/video.html'),
        },
      //  external: ['video.js'],
      },
    },
    server: {
      open: '/pages/index.html',
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true
        }
      }
    },
    // publicDir: resolve(__dirname, 'src/assets'),
  }
}
);