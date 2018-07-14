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
    const scraper = new Scraper(process.env.USERNAME, process.env.PASSWORD);

    describe("launch", function () {
       it("should open the browser", async function() {
           await scraper.setup(false, ['--no-sandbox', '--disable-setuid-sandbox']);
       })
    });

    describe("login", function () {
        it("should perform a login", async function () {
            await scraper.login();
            expect(scraper.page.url()).to.contain("HoManLive")
        })
    });

    describe('retrieve data', function () {
        it("should activate updating data", async function(){
            await scraper.start();
        });

        let data;

        it("should retrieve data", async function(){
            await sleep(10000);
            data = scraper.getData();
            expect(data).to.have.all.keys("pv", "home", "grid", "battery_percentage", "battery_watts");
        });

        it("should have updated data", async function(){
            await sleep(10000);
            let newData = scraper.getData();
            expect(data).to.not.be.equal(newData)
        })
    });

    after(async function(){
        await scraper.destroy();
        scraper.stop();
    })
});
