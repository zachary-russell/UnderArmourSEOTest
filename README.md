# Page Tester

## Requirements

- node v7.6.0+ (for `async` and `await`)

## Installation

Everything is included in the `package.json` dependencies and can be installed with

``` shellsession
% npm i
```

This will install the following packages:

- cheerio
- puppeteer
- mocha
- expect.js

## Preparation

To prepare, simply populate a `urls.json` file with an array of URLs. See `urls.json.example` for the desired format.

## Running

The page tests are written as a Mocha test suite, and as such with a `urls.json` in place, all that is required to run the tests is to execute `mocha` with `npm test`. When this is complete, you should see something like this:

```
  Page Tests
    http://localhost:8080
      Page Title
        ✓ should exist
        ✓ should be between 30 and 60 characters
      h1 Tags
        ✓ should have an h1
      Canonical Tag
        ✓ should exist
      Meta Description
        ✓ should exist
        ✓ should be between 40 and 165 characters
      Image Tags
        ✓ should have alt text on all images
      Robots Tags
        ✓ should be indexable
        ✓ should be followable


  9 passing (417ms)
```

with entries under `Page Tests` for each URL provided.