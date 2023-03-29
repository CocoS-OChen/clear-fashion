const puppeteer = require('puppeteer');

(async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.dedicatedbrand.com/en/men/news');

  const products = await page.evaluate(() => {
    const productList = [];
    const productNodes = document.querySelectorAll('.productList-item');

    for (let i = 0; i < productNodes.length; i++) {
      const productNode = productNodes[i];

      const brand = 'Dedicated';
      const image = productNode.querySelector('img.productList-img').getAttribute('src');
      const title = productNode.querySelector('.productList-title').textContent.trim();
      const price = parseFloat(productNode.querySelector('.productList-price').textContent.replace(/[^\d,.]/g, '').replace(',', '.'));
      const quality = productNode.querySelector('.productList-subtitle').textContent.trim();

      productList.push({
        brand,
        image,
        title,
        price,
        quality
      });
    }

    return productList;
  });

  console.log(products);

  await browser.close();
})();
