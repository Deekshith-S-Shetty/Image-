const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { setTimeout } = require("node:timers/promises");

puppeteer.use(StealthPlugin());

const searchQuery = "bugatti chiron";

async function getImagesData(page) {
  const imagesResults = [];
  const images = await page.$$("img.YQ4gaf:not([class*=' '])");
  for (const image of images) {
    const src = await image.evaluate((img) => img.getAttribute("src"));
    if (src && src.startsWith("data:image/jpeg")) {
      imagesResults.push({ src });
    }
  }
  return imagesResults;
}

async function getGoogleImagesResults() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const URL = `https://www.google.com/search?q=${encodeURI(
    searchQuery
  )}&tbm=isch&hl=en&gl=es`;

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(URL);
  await page.waitForSelector(".YQ4gaf");

  const imagesResults = await getImagesData(page);

  await browser.close();

  return imagesResults;
}

getGoogleImagesResults().then((result) => console.dir(result, { depth: null }));
