const puppeteer = require('puppeteer');

(async function scrapeData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.montlimart.com/72-nouveautes');
  
  const products = await page.evaluate(() => {
    const productList = [];
    const productElements = document.querySelectorAll('#js-product-list > div.products-list.row > div');
    
    for (let element of productElements) {
      productList.push({
        brand: 'Montlimart',
        image: element.querySelector('#js-product-list > div > div > article > div > a > img')?.getAttribute('data-src'),
        title: element.querySelector('#js-product-list > div > div > article > div > h3')?.textContent.trim(),
        price: parseFloat(element.querySelector('#js-product-list > div > div > article > div > div > span')?.textContent),
        color: element.querySelector('#js-product-list > div > div > article > div > div').textContent.trim(),
      });
    }
    
    return productList;
  });
  
  console.log(products);
  await browser.close();
})();
