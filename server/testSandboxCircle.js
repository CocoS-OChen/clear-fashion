const dedicatedBrand = require('./eshops/Circle_Sportwear.js');
const fileSystem = require('fs');

function writeJsonToFile(filePath, jsonData) {
  const serializedData = JSON.stringify(jsonData, null, 2);

  if (fileSystem.existsSync(filePath)) {
    fileSystem.appendFileSync(filePath, `${serializedData}\n`);
  } else {
    fileSystem.writeFileSync(filePath, serializedData);
  }
}

async function scrapeEshop(eshopUrl = 'https://shop.circlesportswear.com/collections/all') {
  try {
    console.log(`🕵️‍♀️  Browsing ${eshopUrl} eshop...`);

    const products = await dedicatedBrand.scrape(eshopUrl);
    writeJsonToFile('dataCircle.json', products);

    console.log('✅  Successfully scraped and saved data to "dataCircle.json" file.');
    process.exit(0);
  } catch (error) {
    console.error(`❌  An error occurred while scraping data from ${eshopUrl} eshop:`, error);
    process.exit(1);
  }
}

const [, , eshopUrl] = process.argv;

scrapeEshop(eshopUrl);

module.exports = {
  scrapeEshop,
};
