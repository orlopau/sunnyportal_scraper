const puppeteer = require('puppeteer');
const sunny_helper = require('./helpers');

module.exports = class Scraper {
    /**
     * @param {string} username Username for sunnyportal
     * @param {string} password Password
     * @param {number }refreshLoginTimer time until login is refreshed in seconds
     * @param {number} dataRefreshTimer data update interval in seconds
     */
    constructor(username, password, refreshLoginTimer = 5 * 60, dataRefreshTimer = 5) {
        this.user = username;
        this.pass = password;
        this.timeRefreshMillis = refreshLoginTimer * 1000;
        this.dataRefreshMillis = dataRefreshTimer * 1000;
        this.data = null;
        this.isRelogging = false;
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
     * get data
     * @returns {?SunnyData}
     */
    getData(){
        return this.data;
    }

    /**
     * Starts retrieving data
     */
    async start(){
        this.loginInterval = setInterval(async () => {
            try {
                this.isRelogging = true;
                await this.login();
                this.isRelogging = false
            } catch (e) {
                throw new Error(e)
            }
        }, this.timeRefreshMillis);

        this.dataInterval = setInterval(async () => {
            try {
                if(!this.isRelogging){
                    this.data = await sunny_helper.getStatusData(this.page);
                }
            } catch (e) {
                throw new Error(e)
            }
        }, this.dataRefreshMillis);


        await this.login();
    }

    /**
     * Stops retrieving data
     */
    stop(){
        clearInterval(this.loginInterval);
        clearInterval(this.dataInterval);
    }

    /**
     * Call on destroying the instance.
     * @returns {Promise<void>} resolves when destroyed
     */
    async destroy(){
        await this.browser.close();
    }

    /**
     * Performs login or relog on page.
     * @returns {Promise<void>}
     */
    async login(){
        await this.page.goto("https://www.sunnyportal.com", {waitUntil: "domcontentloaded"});
        if (this.page.$("ctl00_ContentPlaceHolder1_Logincontrol1_DivLogin") != null && !this.page.url().includes("UserProfile")) {
            /* Not logged in, login field exists. */
            await sunny_helper.authenticate(this.page, this.pass, this.user)
        }

        await sunny_helper.navigateToStatusPage(this.page)
    }

};