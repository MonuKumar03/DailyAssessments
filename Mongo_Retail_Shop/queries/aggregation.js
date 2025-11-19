async function aggregations(db) {
  const orders = db.collection("orders");

  console.log("\n=== Total sales per product ===");
  console.log(await orders.aggregate([
    { $unwind: "$products" },
    { $group: { _id: "$products.productId", totalSold: { $sum: "$products.quantity" } } }
  ]).toArray());

  console.log("\n=== Top-selling categories ===");
  console.log(await orders.aggregate([
    { $unwind: "$products" },
    { $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails"
    }},
    { $unwind: "$productDetails" },
    { $group: { _id: "$productDetails.category", totalSold: { $sum: "$products.quantity" } } },
    { $sort: { totalSold: -1 } }
  ]).toArray());
}

module.exports = aggregations;
