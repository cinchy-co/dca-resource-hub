import {ScullyConfig, setPluginConfig} from '@scullyio/scully';

/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer'

import { baseHrefRewrite } from '@scullyio/scully-plugin-base-href-rewrite'

const defaultPostRenderers = ['seoHrefOptimise', baseHrefRewrite]
setPluginConfig(baseHrefRewrite, {
  href: '/hub/',
})
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
