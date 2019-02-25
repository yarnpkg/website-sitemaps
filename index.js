require('dotenv').config();
const algoliaSitemap = require('algolia-sitemap');
const { mkdirSync } = require('fs');

const algoliaConfig = {
  appId: 'OFCNCOG2CU',
  apiKey: process.env.ALGOLIA_BROWSE_KEY,
  indexName: 'npm-search',
};

function hitToParams(hit) {
  const url = ({ lang, name }) => `https://yarnpkg.com/${lang}/package/${name}`;
  const loc = url({ lang: 'en', name: hit.name });
  const lastmod = new Date(hit.modified).toISOString();
  const priority = hit.downloadsRatio || 0.5;
  return {
    loc,
    lastmod,
    priority,
    alternates: {
      languages: ['fr', 'pt-BR', 'zh-Hans'],
      hitToURL: lang => url({ lang, name: hit.name }),
    },
  };
}

mkdirSync('build', { recursive: true });

algoliaSitemap({
  algoliaConfig,
  sitemapLoc: 'https://yarnpkg.com/sitemaps',
  outputFolder: 'build',
  hitToParams,
})
  .then(() => console.log('Sitemap generated successfully'))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
