const puppeteer = require('puppeteer');

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
     * @param {boolean} hadless True for headless operation.
     * @returns {Promise<void>}
     */
    async setup(hadless = true) {
        this.browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
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
            await this._authenticate();
        } else {
            /* Already logged in. */
        }
    }

    /**
     * Performs login action and navigates to next site.
     * @returns {Promise<void>}
     * @private
     */
    async _authenticate() {
        let user_field = await this.page.$("#txtUserName");
        let password_field = await this.page.$("#txtPassword");
        let button = await this.page.$("#ctl00_ContentPlaceHolder1_Logincontrol1_LoginBtn");

        await user_field.type(this.user);
        await password_field.type(this.pass);

        const navPromise = this.page.waitForNavigation();
        await button.click();
        await navPromise;
    }
};