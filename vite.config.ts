import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pkg from './package.json';

const peerDeps = Object.keys(pkg.peerDependencies || {});
const deps = Object.keys(pkg.dependencies || {});
const external = [...peerDeps, /* optionally externalize some deps from deps */];

export default defineConfig({
  plugins: [react()],
  base: '/email-builder-js/',
  build: {
    lib: {
      entry: 'src/Editor/index.tsx',
      name: 'SimpleEmailBuilder', // global UMD name
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          // add other globals as required for UMD
        },
      },
    },
  },
});