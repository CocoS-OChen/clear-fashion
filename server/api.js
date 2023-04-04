const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const MongoClient = require('./mongoDb');


const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('', async (req, res) => {
  console.log("/produits/recherche, input : ", req.query);
  
  const body = {
    success: true,
    data: {}
  };

  let brandName = req.query.marque || null;
  let lessThanPrice = req.query.prix ? parseFloat(req.query.prix) : null;
  let limitCount = req.query.limite ? parseInt(req.query.limite) : null;

  const produits = await MongoClient.fetchProduits(brandName, lessThanPrice);
  let result = limitCount !== null ? produits.slice(0, limitCount) : produits;

  body.data.resultat = result;

  res.send(body);
});



app.get('/products/search', async (req, res) => {
  console.log("/products/search, input : ", req.query);

  const responseBody = {
    success: true,
    data: {}
  };

  let brandName = req.query.brand || null;
  let lessThanPrice = req.query.price ? parseFloat(req.query.price) : null;
  let limitCount = req.query.limit ? parseInt(req.query.limit) : null;

  const produits = await MongoClient.fetchProducts(brandName, lessThanPrice);
  let result = limitCount !== null ? produits.slice(0, limitCount) : produits;

  responseBody.data.result = result;

  res.send(responseBody);
});


app.get('/products/*', async (req, res) => {
  console.log("products/:id, input : ", req.params[0]);

  const responseBody = {
    success: true,
    data: {}
  };

  const uuid = req.params[0];
  const product = await MongoClient.fetchProductByUuid(uuid);

  responseBody.data.resultat = product;

  res.send(responseBody);
});



app.get('/brands', async (req, res) => {
  console.log("/brands, input : ", req.query);

  const responseBody = {
    success: true,
    data: {}
  };

  const brands = await MongoClient.fetchBrands();

  responseBody.data.brands = brands;

  res.send(responseBody);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);