const expect = require('expect.js');
const cheerio = require('cheerio');
const validUrl = require('valid-url');

const scraper = require('../scraper');

const urlCats = require('../urls');

const TITLE_LENGTH_MIN = 30;
const TITLE_LENGTH_MAX = 60;

const META_DESCRIPTION_LENGTH_MIN = 40;
const META_DESCRIPTION_LENGTH_MAX = 165;

const allUnique = (xs) => {
  let found = [];
  for (var i in xs) {
    const x = xs[i];
    if (found.indexOf(x) >= 0) {
      return false;
    }

    found.push(x);
  }

  return true;
};

urlCats.forEach(({ name, urls }) => {
  describe(`Testing "${name}" URLs`, () => {
    let canonicals = {};
    let titles = [];
    let descriptions = [];

    urls.forEach((url) => {
      let content = null;
      let $ = null;

      before(async () => {
        content = await scraper.renderPage(url);
        $ = cheerio.load(content);
      });

      describe(url, () => {
        describe('Page Title', () => {
          let title = null;
          before(() => {
            title = scraper.getTitle($);
          });

          it('should exist', () => {
            expect(title).not.to.be(null);
          });

          it('should be between 30 and 60 characters', () => {
            expect((title || '').length)
              .to.be.within(TITLE_LENGTH_MIN, TITLE_LENGTH_MAX);
          });

          after(() => title !== null && titles.push(title));
        });

        describe('h1 Tags', () => {
          let h1s = [];
          before(() => {
            h1s = scraper.getH1s($);
          });

          it('should have an h1', () => {
            expect(h1s.length).not.to.be(0);
          });
        });

        describe('Canonical Tag', () => {
          let canonical = null;
          before(() => {
            canonical = scraper.getCanonical($);
          });

          it('should exist', () => {
            expect(canonical).not.to.be(null);
          });

          it('should be a valid URL', () => {
            expect(validUrl.isUri(canonical)).not.to.be(undefined);
          });

          after(() => canonicals[url] = canonical);
        });

        describe('Meta Description', () => {
          let description = null;
          before(() => {
            description = scraper.getMetaDescription($);
          });

          it('should exist', () => {
            expect(description).not.to.be(null);
          });

          it('should be between 40 and 165 characters', () => {
            expect((description || '').length)
              .to.be
              .within(META_DESCRIPTION_LENGTH_MIN, META_DESCRIPTION_LENGTH_MAX);
          });

          after(() => description !== null && descriptions.push(description));
        });

        describe('Image Tags', () => {
          let images = [];
          before(() => {
            images = scraper.getImages($);
          });

          const missingAlt = (_, img) => img.attribs.alt === undefined;

          it('should have alt text on all images', () => {
            const noAlts = images.filter(missingAlt);
            expect(noAlts.length).to.be(0);
          });
        });

        describe('Robots Tags', () => {
          let robotOptions = [];
          before(() => {
            robotsOptions = scraper.getRobotsOptions($);
          });

          it('should be indexable', () => {
            expect(robotsOptions).not.to.contain('noindex');
          });

          it('should be followable', () => {
            expect(robotsOptions).not.to.contain('nofollow');
          });
        });
      });
    });

    // NB: these tests are only checking titles and meta descriptions
    // that are present (i.e. if no title is provided, that URL is not
    // considered in that uniqueness test).
    describe('URLs in group', () => {
      it('should have unique titles', () => {
        expect(allUnique(titles)).to.be(true);
      });

      it('should have unique meta descriptions', () => {
        expect(allUnique(descriptions)).to.be(true);
      });
    });

    after(() => {
      // Determine if all canonical URLs are self-referencing
      const isSelf = url => canonicals[url] === url;
      const allSelf = Object.keys(canonicals).reduce((acc, url) => {
        return acc && isSelf(url);
      }, true);

      console.log(`Canonical URLs in ${name} all self-referencing: ${allSelf}`);
    });
  });
});
