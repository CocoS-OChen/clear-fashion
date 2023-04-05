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

app.get('/products/search', async (req, res) => {
  const brandName = req.query.brand || null;
  const lessThanPrice = req.query.price ? parseFloat(req.query.price) : null;
  const limitCount = req.query.limit ? parseInt(req.query.limit) : null;

  if (limitCount && isNaN(limitCount)) {
    return res.status(400).send({ success: false, error: 'Le paramètre "limit" doit être un nombre entier valide.' });
  }

  if (lessThanPrice && isNaN(lessThanPrice)) {
    return res.status(400).send({ success: false, error: 'Le paramètre "price" doit être un nombre à virgule flottante valide.' });
  }

  const produits = await MongoClient.fetchProducts(brandName, lessThanPrice);

  let result = limitCount !== null ? produits.slice(0, limitCount) : produits;

  res.send({ success: true, data: { result } });
});

app.get('/products/:id', async (req, res) => {
  const uuid = req.params.id;
  const product = await MongoClient.fetchProductByUuid(uuid);

  if (!product) {
    return res.status(404).send({ success: false, error: 'Le produit demandé n\'existe pas.' });
  }

  res.send({ success: true, data: { result: product } });
});

app.get('/brands', async (req, res) => {
  const brands = await MongoClient.fetchBrands();

  res.send({ success: true, data: { brands } });
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
