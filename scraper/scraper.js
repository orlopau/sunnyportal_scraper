/**
 * @fileOverview Scraper
 * @author Paul Orlob
 * @module scraper
 */

const puppeteer = require('puppeteer');
const sunny_helper = require('./helpers');

class Scraper {

    /**
     * @constructor
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
        this.relogTimeout = false;
    }

    /**
     * Setups the scraper. Needs to be called once.
     * @param {boolean} headless True for headless operation.
     * @param {Array} args args for chromium
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
    getData() {
        return this.data;
    }

    /**
     * Starts retrieving data
     */
    async start() {
        let relog = async () => {
            if (this.isRelogging) {
                return;
            }

            console.log("relogging...");
            await this.page._client.send('Network.clearBrowserCookies');
            try {
                this.isRelogging = true;
                await this.login();
            } catch (e) {
                console.log("Login failed with " + e);
            } finally {
                await this._sleep(3000);
                this.isRelogging = false
            }
        };

        let data = async () => {
            try {
                if (!this.isRelogging) {
                    this.data = await sunny_helper.getStatusData(this.page);
                }
            } catch (e) {
                console.log("Data could not be retrieved! Relogging.");
                await relog()
            }
        };

        this.loginInterval = setInterval(relog, this.timeRefreshMillis);

        this.dataInterval = setInterval(data, this.dataRefreshMillis);


        await this.login();
    }

    /**
     * Stops retrieving data
     */
    stop() {
        clearInterval(this.loginInterval);
        clearInterval(this.dataInterval);
    }

    /**
     * Call to destroy the browser instance.
     * @returns {Promise<void>} resolves when destroyed
     */
    async destroy() {
        await this.browser.close();
    }

    /**
     * Performs login or relog on page.
     * @returns {Promise<void>}
     */
    async login() {
        // Login relog timeout
        if(this.relogTimeout){
            console.log("Relog timeout!");
            return
        }

        this.relogTimeout = true;

        setTimeout(() => {
            this.relogTimeout = false;
        }, 30000);

        await this.page.goto("https://www.sunnyportal.com", {waitUntil: "domcontentloaded"});
        if (this.page.$("ctl00_ContentPlaceHolder1_Logincontrol1_DivLogin") != null && !this.page.url().includes("UserProfile")) {
            /* Not logged in, login field exists. */
            try {
                await sunny_helper.authenticate(this.page, this.pass, this.user);
            } catch (e) {
                console.log("Error in login method: Couldnt authenticate: " + e);
            }
        }

        await sunny_helper.navigateToStatusPage(this.page)
    }

    async _sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

}

module.exports = Scraper;