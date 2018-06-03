const expect = require("chai").expect;
const Scraper = require("../scraper/scraper.js");

describe("Scraper", function () {
    this.timeout(20000);
    let scraper = new Scraper(process.env.SUNNY_USER, process.env.SUNNY_PASS);

    describe("login", function () {
        it("should perform a login", async function () {
            await scraper.setup(false);
            await scraper.login();
            expect(scraper.page.url()).to.contain("https://www.sunnyportal.com/Templates/UserProfile.aspx")
        })
    });

    describe("navigation", function(){
       it("should navigate to the current status page", async function(){
           await scraper._navigateToStatusPage();
           expect(scraper.page.url()).to.contain("https://www.sunnyportal.com/FixedPages/HoManLive.aspx")
       })
    });

    describe('retrieve data', function () {
        it("should retrieve current data", async function(){
            await scraper.getData();
        })
    });
});
