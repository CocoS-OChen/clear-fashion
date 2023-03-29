const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('https://shop.circlesportswear.com/collections/nouveautes');

  const products = await page.evaluate(() => {
    const productsList = [];
    const elements = document.querySelectorAll('#product-grid > li');
    for (let i = 0; i < elements.length; i++) {
      const product = {};
      const element = elements[i];

      product.brand = 'Circle_Sportswear';
      product.image = element.querySelector('#product-grid > li > div > div > div > div > div > img')?.src;
      product.title = element.querySelector('#product-grid > li > div > div > div.card__content > div.card__information > h3')?.textContent.trim();
      product.price = element.querySelector('#product-grid > li > div > div > div.card__content > div.card__information > div.card-information > div > div > div.price__sale > span.price-item.price-item--sale.price-item--last > span')?.textContent.trim();
      product.quality = element.querySelector('#product-grid > li > div > div > div.card__content > div.card__information > h4')?.textContent.trim();

      productsList.push(product);
    }
    return productsList;
  });

  console.log(products);
  await browser.close();
})();
