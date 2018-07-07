const Scraper = require('./index');
const scraper = new Scraper(process.env.USERNAME, process.env.PASSWORD, 15);

async function setup() {
    await scraper.setup(false, ['--no-sandbox', '--disable-setuid-sandbox']);
    await scraper.start();
}

function destroy() {
    scraper.destroy().then(() => {
    }).catch(() => {
        console.log("Couldnt close chromium.");
        process.exit(1)
    })
}

process.on('SIGTERM', destroy);
process.on('SIGINT', destroy);

setup().then(() => {
    setInterval(() => {
        console.log(scraper.getData());
    }, 5000);
});