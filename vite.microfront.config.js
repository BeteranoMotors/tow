import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/microfront/index.js',
      name: 'BTR_Tow',
      formats: ['iife'],
      fileName: () => `btr-tow.js`
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    sourcemap: true
  }
})
