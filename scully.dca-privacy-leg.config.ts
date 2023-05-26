import {ScullyConfig, setPluginConfig} from '@scullyio/scully';

/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer'

import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite';
import { getSitemapPlugin } from '@gammastream/scully-plugin-sitemap';

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite]
setPluginConfig(baseHrefRewrite, {
  href: '/hub/',
})

const SitemapPlugin = getSitemapPlugin();
setPluginConfig(SitemapPlugin, {
  urlPrefix: 'https://datacollaboration.net/hub/',
  sitemapFilename: 'sitemap.xml',
  merge: false,
  trailingSlash: true,
  changeFreq: 'monthly',
  priority: ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1', '0.0'],
  ignoredRoutes: ['/404']
});

export const config: ScullyConfig = {
  defaultPostRenderers,
  projectRoot: "./src",
  projectName: "dca-privacy-leg",
  // add spsModulePath when using de Scully Platform Server,
  outDir: './dist/static',
  staticPort: 3000,
  routes: {
  }
};
