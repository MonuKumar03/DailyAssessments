const { MongoClient } = require('mongodb');
const basicQueries = require('./queries/basic_queries');
const aggregations = require('./queries/aggregations');
const indexOptimization = require('./queries/index_optimization');

const uri = "mongodb+srv://monujaiswalk123_db_user:Atlas@97084@cluster0.hi4qbsj.mongodb.net/";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db("RetailDB");

    await indexOptimization(db);
    await basicQueries(db);
    await aggregations(db);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
