const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.montlimart.com/';

async function getNavigationLinks() {
  try {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const navigationLinks = $('#adtm_menu a');
    const navigationLinksArray = [];
    navigationLinks.each((index, link) => {
      const url = $(link).attr('href');
      navigationLinksArray.push(url);
    });
    fs.writeFile('navLinksMon.json', JSON.stringify(navigationLinksArray), (error) => {
      if (error) throw error;
      console.log('Les liens ont été écrits dans le fichier .json');
    });

  } catch (error) {
    console.error(error);
  }
}

getNavigationLinks();
