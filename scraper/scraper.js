const puppeteer = require('puppeteer');
const sunny_helper = require('./helpers');

module.exports = class Scraper {
    /**
     * @param username Username for sunnyportal
     * @param password Password
     */
    constructor(username, password) {
        this.user = username;
        this.pass = password
    }

    /**
     * Setups the scraper. Needs to be called once.
     * @param {boolean} headless True for headless operation.
     * @param {Array} args for chromium
     * @returns {Promise<void>}
     */
    async setup(headless = true, args = []) {
        this.browser = await puppeteer.launch({headless: headless, args: args});
        this.page = await this.browser.newPage();
    }

    /**
     * Performs login or relog on page.
     * @returns {Promise<void>}
     */
    async login() {
        await this.page.goto("https://www.sunnyportal.com", {waitUntil: "domcontentloaded"});
        if (this.page.$("ctl00_ContentPlaceHolder1_Logincontrol1_DivLogin") != null) {
            /* Not logged in, login field exists. */
            await sunny_helper.authenticate(this.page, this.pass, this.user)
        } else {
            /* Already logged in. */
        }
    }

};