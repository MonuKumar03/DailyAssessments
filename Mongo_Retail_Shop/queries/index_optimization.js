async function indexOptimization(db) {
  const products = db.collection("products");
  const orders = db.collection("orders");
  const users = db.collection("users");

  console.log("\n=== Creating indexes ===");
  await products.createIndex({ category: 1 });
  await orders.createIndex({ userId: 1, orderDate: -1 });
  await orders.createIndex({ orderDate: -1 });
  await users.createIndex({ email: 1 }, { unique: true });

  console.log(" Indexes created successfully");
}

module.exports = indexOptimization;
