const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://monujaiswalk123_db_user:Atlas@97084@cluster0.hi4qbsj.mongodb.net/";
const client = new MongoClient(uri);

async function insertData() {
  try {
    await client.connect();
    const db = client.db("Retail-Shop");
    const collection = db.collection("products");

    const count = await collection.countDocuments();
    if (count === 0) {
      const data = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
      await collection.insertMany(data);
      console.log(`✅ Inserted ${data.length} products`);
    } else {
      console.log(`Collection already has ${count} products`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

insertData();
