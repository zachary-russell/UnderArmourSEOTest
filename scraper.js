const puppeteer = require('puppeteer');

const { chromeArgs } = require('./config');

module.exports = {
  // Content parsing
  getTitle: ($) => {
    const $title = $('title');
    if (!$title[0]) {
      return null;
    }

    return $title.text();
  },

  getCanonical: ($) => {
    const canonicals = $('link[rel="canonical"]');
    if (canonicals.length === 0) {
      return null;
    }

    return $(canonicals[0]).attr('href');
  },

  getMetaDescription: ($) => {
    const metaDesc = $('meta[name="description"]');
    if (metaDesc.length === 0) {
      return null;
    }

    return $(metaDesc[0]).attr('content');
  },

  getRobotsOptions: ($) => {
    const robotsTag = $('meta[name="robots"]');
    if (robotsTag.length === 0) {
      return [];
    }

    const optStr = $(robotsTag[0]).attr('content');
    return (optStr || '').split(/, /);
  },

  getH1s: ($) => {
    return $('h1');
  },

  getImages: ($) => {
    return $('img');
  },

  renderPage: async (url) => {
    const args = chromeArgs || {};
    return await puppeteer.launch({ args })
      .then(async (browser) => {
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();

        browser.close();

        return content;
      });
  }
};
