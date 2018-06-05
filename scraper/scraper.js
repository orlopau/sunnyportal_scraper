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
            await this._authenticate();
        } else {
            /* Already logged in. */
        }
    }

    async getData(){
        let pv_text = await this.page.$("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-pv > div > span.batteryStatus-value.h3.header");
        let home_text = await this.page.$("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-consumption > div.batteryStatus-text > span.batteryStatus-value.h3.header");
        let grid_text = await this.page.$("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-grid > div > span.batteryStatus-value.h3.header");
        let battery_percentage = await this.page.$("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-battery > div.batteryStatus-text.battery-percentage > span.batteryStatus-value.h3.header");
        let battery_watts = await this.page.$("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-battery > div.batteryStatus-text.battery-power > span.batteryStatus-value.h3.header");


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

        if(this.user == null || this.pass == null){
            throw new TypeError("No username or password specified")
        }

        await user_field.type(this.user);
        await password_field.type(this.pass);

        const navPromise = this.page.waitForNavigation({waitUntil: "domcontentloaded"});
        await button.click();
        await navPromise;
    }

    /**
     * navigates from logged in start page to current status
     * @returns {Promise<void>}
     * @private
     */
    async _navigateToStatusPage(){
        let button_chevron = await this.page.$("#collapseNavi");
        await button_chevron.click();

        let nav_promise = this.page.waitForNavigation({waitUntil: "domcontentloaded"});
        let button_status = await this.page.$("#ctl00_NavigationLeftMenuControl_0_2");
        await button_status.click();
        await nav_promise;
    }
};