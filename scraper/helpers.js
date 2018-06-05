const Puppeteer = require("puppeteer");

class Helpers {
    /**
     * Puppeteer
     * @external "Puppeteer"
     */

    /**
     * Performs login action and navigates to next site.
     * @param page {Puppeteer.Page}
     * @param pass {string} password
     * @param user {string} username
     * @returns {!Promise<void>}
     */
    static async authenticate(page, pass, user) {
        let user_field = await page.$("#txtUserName");
        let password_field = await page.$("#txtPassword");
        let button = await page.$("#ctl00_ContentPlaceHolder1_Logincontrol1_LoginBtn");

        if (user == null || pass == null) {
            throw new TypeError("No username or password specified")
        }

        await user_field.type(user);
        await password_field.type(pass);

        const navPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
        await button.click();
        await navPromise;
    }

    /**
     * navigates from logged in start page to current status
     * @returns {!Promise<void>}
     */
    static async navigateToStatusPage(page) {
        let button_chevron = await page.$("#collapseNavi");
        await button_chevron.click();

        let nav_promise = page.waitForNavigation({waitUntil: "domcontentloaded"});
        let button_status = await page.$("#ctl00_NavigationLeftMenuControl_0_2");
        await button_status.click();
        await nav_promise;
    }

    /**
     * Sunnyportal data
     * @typedef {Object} SunnyData
     * @property {number} pv PV consumption
     * @property {number} home home consumption
     * @property {number} grid grid feed is negative, grid draw is positive
     * @property {number} battery_percentage percentage of pv battery
     * @property {number} battery_watts battery charging is negative, battery usage positive
     */

    /**
     * Retrieves data from status page
     * @param page {Puppeteer.page}
     * @returns {!Promise<SunnyData>} data object
     */
    static async getStatusData(page) {
        let pv_text = await this._getInnerHTML(page, "#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-pv > div > span.batteryStatus-value.h3.header");
        let home_text = await this._getInnerHTML(page, "#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-consumption > div.batteryStatus-text > span.batteryStatus-value.h3.header");
        let grid_text = await this._getInnerHTML(page, "#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-grid > div > span.batteryStatus-value.h3.header");
        let battery_percentage_text = await this._getInnerHTML(page, "#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-battery > div.batteryStatus-text.battery-percentage > span.batteryStatus-value.h3.header");
        let battery_watts_text = await this._getInnerHTML(page, "#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-battery > div.batteryStatus-text.battery-power > span.batteryStatus-value.h3.header");

        let grid_attribute_value = await page.$eval("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-grid", (element) => {
                return element.getAttribute("data-grid")
            });

        let battery_attribute_value = await page.$eval("#ctl00_ContentPlaceHolder1_LiveSSEnabled > div:nth-child(4) > div.batteryStatus-container > div.batteryStatus-battery", (element) => {
                return element.getAttribute("data-status")
            });

        let grid = this._convertAndRound(grid_text);
        if (grid_attribute_value === "feedIn") {
            grid *= -1
        }

        let battery_watts = this._convertAndRound(battery_watts_text);
        if (battery_attribute_value === "charge") {
            battery_watts *= -1
        }

        return {
            pv: this._convertAndRound(pv_text),
            home: this._convertAndRound(home_text),
            grid: grid,
            battery_percentage: this._convertAndRound(battery_percentage_text, 0),
            battery_watts: battery_watts
        };

    }

    /**
     * Converts a string to float and rounds it.
     * @param string
     * @param decimalPlaces
     * @returns {number}
     * @private
     */
    static _convertAndRound(string, decimalPlaces = 2) {
        let number = parseFloat(string).toFixed(decimalPlaces);
        return parseFloat(number);
    }

    static async _getInnerHTML(root, selector) {
        return await root.$eval(selector, (element) => {
            return element.innerHTML
        })
    }

}

module.exports = Helpers;