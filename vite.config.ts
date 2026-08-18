import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Vite's static handler leaves Content-Type empty for .docx, which makes
// browsers sniff the file as a bare zip archive instead of a Word document.
const docxMimeType = (): Plugin => ({
  name: 'docx-mime-type',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith('.docx')) {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), docxMimeType()],
  server: {
    port: 5173,
    open: true,
  },
});
