# Sunnyportal Scraper

[![NPM](https://nodei.co/npm/sunnyportal-scraper.png)](https://nodei.co/npm/sunnyportal-scraper/)

NodeJS library to retrieve information on PV plants from the [Sunnyportal](https://www.sunnyportal.com).  
Documentation can be found [here](https://orlopau.github.io/sunnyportal_scraper).

## Usage

Import the library and instantiate a new Scraper.

```js
const Scraper = require("sunnyportal-scraper");
const scraper = new Scraper('username', 'password');
```

Setup the scraper. This operation is asynchronous.

```js
await scraper.setup(false); 
```

Additional parameters can be specified, especially if chromium doesnt run.
Refer to [puppeteer troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md).

```js
await scraper.setup(false, ['--no-sandbox', '--disable-setuid-sandbox']);
```

To start the loop that updates the data:

```js
await scraper.start();

// Retrieve data
let data = scraper.getData();
```

After your application has finished, close the browser instance

```js
await scraper.destroy();
```

## Tests

Tests can be run using Mocha. Username and password have to be provided using environment variables.

```
SUNNY_USER = username
SUNNY_PASS = password
```

