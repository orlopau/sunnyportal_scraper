const expect = require("chai").expect;
const Scraper = require("../scraper/scraper.js");

describe("Scraper", function () {
    this.timeout(10000);
    let scraper = new Scraper(process.env.SUNNY_USER, process.env.SUNNY_PASS);
    describe("login", function () {
        let success_flag = true;
        it("should perform a login", async function () {
            await scraper.setup(false);
            await scraper.login();
            expect(scraper.page.url()).contains("https://www.sunnyportal.com/Templates/UserProfile.aspx")
        })
    })
});
