// vite.microfront.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
      output: { inlineDynamicImports: true }
    },
    sourcemap: true
  },
  // evita 'process is not defined' en el browser
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': {}  // salvaguarda extra
  }
})
