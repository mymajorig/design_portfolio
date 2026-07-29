export default {
  root: 'portfolio',
  server: {
    // Forward any request starting with /api to the Node API (server/index.js)
    // so the front-end can use relative URLs like fetch('/api/projects').
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
