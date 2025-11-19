async function basicQueries(db) {
  const products = db.collection("products");

  console.log("\n=== Products in category Smartphones ===");
  console.log(await products.find({ category: "Smartphones" }).toArray());

  console.log("\n=== Products priced below $500 ===");
  console.log(await products.find({ price: { $lt: 500 } }).toArray());
}

module.exports = basicQueries;
