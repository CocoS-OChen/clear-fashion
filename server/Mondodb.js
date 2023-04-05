const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://cocogrep:Db-VE8%r_yZW35z@cluster0.izdiwww.mongodb.net/test?retryWrites=true&w=majority';
const MONGO_DB_NAME = 'clearfashion';
const MONGO_COLLECTION_NAME = 'clearfashion_collection';
const fs = require('fs');

let globalCollection = null;
let globalDb = null;
let globalClient = null;


async function connectToDatabase() {
  try {
    console.log("Connecting...");
    const client = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true });
    const db = client.db(MONGO_DB_NAME);
    const collection = db.collection(MONGO_COLLECTION_NAME);
    const count = await collection.countDocuments();
    console.log(`${count} documents found in collection ${MONGO_COLLECTION_NAME}.`);
    globalCollection = collection;
    globalDb = db;
    globalClient = client;
    console.log("Connected to database.");
  } catch (error) {
    console.error(error);
  }
}


async function insertProductsToDatabase() {
  try {
    await connectToDatabase();
    console.log("Inserting products to the database...");
    const productsToInsert = JSON.parse(fs.readFileSync('data_montlimart.json'));
    const insertedProducts = await globalCollection.insertMany(productsToInsert);
    console.log(`${insertedProducts.insertedCount} products inserted to the ${MONGO_COLLECTION_NAME} collection.`);
    const productsToInsert2 = JSON.parse(fs.readFileSync('data_Circle_sportwear.json'));
    const insertedProducts2 = await globalCollection.insertMany(productsToInsert2);
    console.log(`${insertedProducts2.insertedCount} products inserted to the ${MONGO_COLLECTION_NAME} collection.`);
    const productsToInsert3 = JSON.parse(fs.readFileSync('data_Dedicated.json'));
    const insertedProducts3 = await globalCollection.insertMany(productsToInsert3);
    console.log(`${insertedProducts3.insertedCount} products inserted to the ${MONGO_COLLECTION_NAME} collection.`);

    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}


async function findProductByName(name) {
  try {
    await connectToDatabase();
    const products = await globalCollection.find({ name: name }).toArray();
    console.log(`${products.length} products found with name "${name}".`);
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}



async function findProductsByPrice(maxPrice) {
  try {
    await connectToDatabase();
    const products = await globalCollection.find({ price: { $lt: maxPrice } }).toArray();
    console.log(`${products.length} products found with a price less than ${maxPrice}.`);
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}


async function sortProductsByPrice() {
  try {
    await connectToDatabase();
    const products = await globalCollection.find().sort({ price: 1 }).toArray();
    console.log(`${products.length} products found and sorted by price in ascending order.`);
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}

 
async function sortProductsByDate() {
  try {
    await connectToDatabase();
    const products = await globalCollection.find().sort({ date: -1 }).toArray();
    console.log(`${products.length} products found and sorted by date in descending order.`);
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}

async function findProductsByScrapedDate() {
  try {
    await connectToDatabase();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const products = await globalCollection.find({ scraped_at: { $lte: twoWeeksAgo } }).toArray();
    console.log(`${products.length} products found with a scraped date older than ${twoWeeksAgo}.`);
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}