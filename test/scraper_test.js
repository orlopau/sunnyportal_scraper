const expect = require("chai").expect;
const sunny_helper = require('../scraper/helpers');
const Scraper = require("../scraper/scraper.js");

/*
 * To correctly run tests, add password and username as environment variables.
 * SUNNY_USER
 * and
 * SUNNY_PASS
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Scraper", function () {
    this.timeout(20000);
    let scraper = new Scraper(process.env.SUNNY_USER, process.env.SUNNY_PASS);

    describe("launch", function () {
       it("should open the browser", async function() {
           await scraper.setup(false, ['--no-sandbox', '--disable-setuid-sandbox']);
       })
    });

    describe("login", function () {
        it("should perform a login", async function () {
            await scraper.login();
            expect(scraper.page.url()).to.contain("https://www.sunnyportal.com/Templates/UserProfile.aspx")
        })
    });

    describe("navigation", function(){
       it("should navigate to the current status page", async function(){
           await sunny_helper.navigateToStatusPage(scraper.page);
           expect(scraper.page.url()).to.contain("https://www.sunnyportal.com/FixedPages/HoManLive.aspx")
       })
    });

    describe('retrieve data', function () {
        it("should retrieve current data", async function(){
            await sleep(5000);
            let data = await sunny_helper.getStatusData(scraper.page);
            console.log(data);
            expect(data).to.have.all.keys("pv", "home", "grid", "battery_percentage", "battery_watts");
        })
    });

    after(function(){
        scraper.browser.close()
    })
});
