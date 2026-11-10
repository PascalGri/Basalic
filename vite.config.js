import { basename } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { projectRoot, readConfig } from './server/config.mjs';
import { createSiteApi } from './server/http.mjs';
import { runtimePages } from './server/pages.mjs';

export default defineConfig(({ mode }) => {
  const config = readConfig(loadEnv(mode, projectRoot, 'BASALIC_'));
  return {
    server: {
      headers: { 'Cache-Control': 'no-store' },
      fs: {
        deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', `**/${basename(config.dataDir)}/**`, '**/.basalic-data/**'],
      },
    },
    plugins: [{
      name: 'basalic-property-admin',
      configureServer(server) {
        server.middlewares.use(createSiteApi(config).middleware);
      },
      configurePreviewServer(server) {
        const { middleware, store } = createSiteApi(config);
        server.middlewares.use(middleware);
        server.middlewares.use(runtimePages(store));
      },
    }],
  };
});
