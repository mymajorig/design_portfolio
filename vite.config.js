import { resolve } from "node:path";

export default {
  root: 'portfolio',
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'portfolio/index.html'),
        about: resolve(import.meta.dirname, 'portfolio/about.html'),
        project: resolve(import.meta.dirname, 'portfolio/project.html')
      }
    }
  }
};
