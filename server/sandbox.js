const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/Montlimart');
const fs = require('fs');
const { promisify } = require('util');

const writeJsonToFile = (filePath, jsonData) => {
  const serializedData = JSON.stringify(jsonData, null, 2);

  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, `${serializedData}\n`);
  } else {
    fs.writeFileSync(filePath, serializedData);
  }
};

async function scrapeAndSaveData(eshopName) {
  try {
    console.log(`🕵️‍♀️  Browsing ${eshopName} eshop...`);

    switch (eshopName.toLowerCase()) {
      case 'dedicated':
        const dedicatedLinks = require('./navLinksDed.json');
        const dedicatedProducts = [];

        for (const link of dedicatedLinks) {
          const data = await dedicatedbrand.scrape(link);
          dedicatedProducts.push(...data);
        }

        writeJsonToFile('data_dedicated.json', dedicatedProducts);
        console.log(dedicatedProducts);
        break;

      case 'montlimart':
        const montlimartLinks = require('./navLinksMon.json');
        const montlimartProducts = [];

        for (const link of montlimartLinks) {
          const data = await montlimartbrand.scrape(link);
          montlimartProducts.push(...data);
        }

        writeJsonToFile('data_montlimart.json', montlimartProducts);
        console.log(montlimartProducts);
        break;

      default:
        console.log(`❌  Eshop ${eshopName} is not supported.`);
        process.exit(1);
    }

    console.log(`✅  Successfully scraped and saved data to "data_${eshopName.toLowerCase()}.json" file.`);
    process.exit(0);
  } catch (error) {
    console.error(`❌  An error occurred while scraping data from ${eshopName} eshop:`, error);
    process.exit(1);
  }
}

const [, , eshopName] = process.argv;

scrapeAndSaveData(eshopName);

module.exports = {
  scrapeAndSaveData,
};
