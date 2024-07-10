const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname)));

// Serve the HTML file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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

app.post("/search", async (req, res) => {
  const searchQuery = req.body.query;
  const browser = await puppeteer.launch({
    headless: true,
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

  res.json(imagesResults);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { setTimeout } = require("node:timers/promises");

// puppeteer.use(StealthPlugin());

// const searchQuery = "bugatti chiron";

// async function getImagesData(page) {
//   const imagesResults = [];
//   const images = await page.$$("img.YQ4gaf:not([class*=' '])");
//   for (const image of images) {
//     const src = await image.evaluate((img) => img.getAttribute("src"));
//     if (src && src.startsWith("data:image/jpeg")) {
//       imagesResults.push({ src });
//     }
//   }
//   return imagesResults;
// }

// async function getGoogleImagesResults() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const URL = `https://www.google.com/search?q=${encodeURI(
//     searchQuery
//   )}&tbm=isch&hl=en&gl=es`;

//   const page = await browser.newPage();

//   await page.setDefaultNavigationTimeout(60000);
//   await page.goto(URL);
//   await page.waitForSelector(".YQ4gaf");

//   const imagesResults = await getImagesData(page);

//   await browser.close();

//   return imagesResults;
// }

// getGoogleImagesResults().then((result) => console.dir(result, { depth: null }));
