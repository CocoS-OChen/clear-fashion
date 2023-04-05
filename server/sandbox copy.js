const dedicatedbrand = require('./eshops/dedicatedbrand.js'); 
const montlimartbrand = require('./eshops/Montlimart.js');
const circlesportswear = require('./eshops/Circle_Sportswear.js');

const link = [
  "https://shop.circlesportswear.com/collections/all", 
  "montlimart", 
  "dedicatedbrand" 
];

async function sandbox (eshop = undefined, number = -1) {
  if(number == -1 && eshop == undefined) { 
    var allProducts = [];
    for(var i = 0; i < link.length; i++) {
      allProducts.push(...await sandbox(link[i], i)); 
    }
    const fs = require('fs');
    allProducts = allProducts.filter((v,i,a)=>a.findIndex(t=>(t.uuid === v.uuid))===i); 
    return allProducts;
  }
  else { 
    try {
      var products = "";
      if(eshop == 'montlimart'){ // Si l'eshop est Montlimart, on récupère les liens vers les différentes pages de produits
        link.push(...await montlimartbrand.getLinks());
        return [];
      }
      else if(eshop.includes('montlimart')){ // Si l'eshop est Montlimart, on exécute la fonction de scraping pour récupérer les produits d'une page
        products = await montlimartbrand.scrape(eshop);
      }
      else if(eshop == 'dedicatedbrand'){ // on récupère tous les produits
        products = await dedicatedbrand.getProducts();
      }
      else if(eshop.includes('dedicatedbrand')){ // on exécute la fonction de scraping pour récupérer les produits d'une page
        products = await dedicatedbrand.scrape(eshop);
      }
      else if(eshop.includes('circlesportswear')){
        products = await circlesportswear.scrape(eshop);
      }
      else { 
        console.log('eshop not found');
        process.exit(1);
      }
      console.log(`Browsing ${eshop} eshop`);
    }
    catch (error) {
      console.log(` An error occurred while browsing ${eshop} eshop: ${error.message}`);
    }
  }
}
module.exports = {
  sandbox
};