import { basename } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { projectRoot, readConfig } from './server/config.mjs';
import { createSiteApi } from './server/http.mjs';
import { runtimePages } from './server/pages.mjs';
import { pagesOutput, readPagesConfig } from './scripts/pages-config.mjs';

export default defineConfig(({ mode }) => {
  if (mode === 'pages') {
    const { base, origin } = readPagesConfig();
    return {
      base,
      build: { outDir: pagesOutput },
      define: { 'import.meta.env.VITE_BASALIC_PAGES_ORIGIN': JSON.stringify(origin) },
    };
  }

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
