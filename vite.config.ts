import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        cart: resolve(__dirname, 'cos-de-cumparaturi.html'),
        sutiene: resolve(__dirname, 'sutiene.html'),
        chiloti: resolve(__dirname, 'chiloti.html'),
        lenjerie: resolve(__dirname, 'lenjerie.html'),
        pijama: resolve(__dirname, 'pijama.html'),
        haineSport: resolve(__dirname, 'haine-sport.html'),
        beauty: resolve(__dirname, 'vs-beauty.html'),
        accesorii: resolve(__dirname, 'accesorii.html'),
        swim: resolve(__dirname, 'swim.html'),
        vsNow: resolve(__dirname, 'vs-now.html'),
        nou: resolve(__dirname, 'nou.html'),
        pink: resolve(__dirname, 'pink.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'inregistrare.html'),
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    open: true,
  },
});
