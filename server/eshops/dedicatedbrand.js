const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  const productList = $('.productList-container .productList');

  setTimeout(() => {}, 30000);

  return productList.map((i, element) => {
    const name = $(element).find('.productList-title').text().trim().replace(/\s/g, ' ');
    const link = $(element).find('.productList-link').attr('href').replace('/en/','https://www.dedicatedbrand.com/en/');
    const price = parseInt($(element).find('.productList-link').find('.productList-price').text());
    const image =  $(element).find('.js-lazy').attr('data-srcset');
    const date = new Date().toString();

    return { name, price, link, image, date };
  }).get();
};





/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*
const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      return {name, price};
    })
    .get();
};