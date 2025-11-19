"use strict";
// Product Management Module using TypeScript
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Enum for Product Categories
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ELECTRONICS"] = "Electronics";
    ProductCategory["CLOTHING"] = "Clothing";
    ProductCategory["HOME"] = "Home & Kitchen";
    ProductCategory["BOOKS"] = "Books";
    ProductCategory["SPORTS"] = "Sports";
})(ProductCategory || (ProductCategory = {}));
// Decorator to log changes in price or stock
function LogChanges(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (...args) {
        const product = this;
        const oldPrice = product.price;
        const oldStock = product.stock;
        // Call the original method
        const result = method.apply(this, args);
        // Check if price changed
        if (propertyName === 'updatePrice' && oldPrice !== product.price) {
            console.log(`Price changed for ${product.name}: $${oldPrice} -> $${product.price}`);
        }
        // Check if stock changed
        if (propertyName === 'updateStock' && oldStock !== product.stock) {
            console.log(`Stock changed for ${product.name}: ${oldStock} -> ${product.stock}`);
        }
        return result;
    };
    return descriptor;
}
// Product Class implementing IProduct interface
class Product {
    constructor(id, name, category, price, stock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
    }
    // Method to update price with decorator
    updatePrice(newPrice) {
        if (newPrice >= 0) {
            this.price = newPrice;
        }
        else {
            console.error("Price cannot be negative");
        }
    }
    // Method to update stock with decorator
    updateStock(newStock) {
        if (newStock >= 0) {
            this.stock = newStock;
        }
        else {
            console.error("Stock cannot be negative");
        }
    }
    // Display product information
    displayInfo() {
        return `[#${this.id}] ${this.name} - ${this.category} - $${this.price} (Stock: ${this.stock})`;
    }
}
__decorate([
    LogChanges,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], Product.prototype, "updatePrice", null);
__decorate([
    LogChanges,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], Product.prototype, "updateStock", null);
// ProductManager Class to handle product operations
class ProductManager {
    constructor() {
        this.products = new Map();
    }
    // Add a product to the manager
    addProduct(product) {
        this.products.set(product.id, product);
        console.log(`Added product: ${product.name}`);
    }
    // Get a product by ID
    getProduct(id) {
        return this.products.get(id);
    }
    // Update product price
    updateProductPrice(id, newPrice) {
        const product = this.getProduct(id);
        if (product) {
            product.updatePrice(newPrice);
            return true;
        }
        console.error(`Product with ID ${id} not found`);
        return false;
    }
    // Update product stock
    updateProductStock(id, newStock) {
        const product = this.getProduct(id);
        if (product) {
            product.updateStock(newStock);
            return true;
        }
        console.error(`Product with ID ${id} not found`);
        return false;
    }
    // Remove a product
    removeProduct(id) {
        const product = this.getProduct(id);
        if (product) {
            this.products.delete(id);
            console.log(`Removed product: ${product.name}`);
            return true;
        }
        console.error(`Product with ID ${id} not found`);
        return false;
    }
    // Get all products
    getAllProducts() {
        return Array.from(this.products.values());
    }
    // Display all products
    displayAllProducts() {
        console.log("\n--- All Products ---");
        if (this.products.size === 0) {
            console.log("No products available");
            return;
        }
        // Using for...of to iterate over the Map
        for (const [id, product] of this.products) {
            console.log(product.displayInfo());
        }
    }
    // Get products by category
    getProductsByCategory(category) {
        const result = [];
        // Using for...of to iterate
        for (const product of this.products.values()) {
            if (product.category === category) {
                result.push(product);
            }
        }
        return result;
    }
    // Get low stock products (stock less than threshold)
    getLowStockProducts(threshold = 10) {
        const result = [];
        // Using for...of to iterate
        for (const product of this.products.values()) {
            if (product.stock < threshold) {
                result.push(product);
            }
        }
        return result;
    }
}
// Demo function to showcase the Product Management System
function demonstrateProductManagement() {
    console.log("=== E-Commerce Product Management System ===\n");
    // Create ProductManager instance
    const productManager = new ProductManager();
    // Create some sample products
    const product1 = new Product(1, "Smartphone X1", ProductCategory.ELECTRONICS, 599.99, 15);
    const product2 = new Product(2, "Cotton T-Shirt", ProductCategory.CLOTHING, 19.99, 45);
    const product3 = new Product(3, "Coffee Maker", ProductCategory.HOME, 79.99, 12);
    const product4 = new Product(4, "JavaScript Guide", ProductCategory.BOOKS, 29.99, 25);
    const product5 = new Product(5, "Running Shoes", ProductCategory.SPORTS, 89.99, 5);
    // Add products to the manager
    productManager.addProduct(product1);
    productManager.addProduct(product2);
    productManager.addProduct(product3);
    productManager.addProduct(product4);
    productManager.addProduct(product5);
    // Display all products
    productManager.displayAllProducts();
    // Demonstrate updating price and stock (decorators will log changes)
    console.log("\n--- Updating Product Price and Stock ---");
    productManager.updateProductPrice(1, 549.99); // Price change
    productManager.updateProductStock(2, 40); // Stock change
    productManager.updateProductStock(5, 15); // Stock change
    // Display all products after updates
    productManager.displayAllProducts();
    // Demonstrate getting products by category
    console.log("\n--- Electronics Products ---");
    const electronicsProducts = productManager.getProductsByCategory(ProductCategory.ELECTRONICS);
    electronicsProducts.forEach(product => {
        console.log(product.displayInfo());
    });
    // Demonstrate getting low stock products
    console.log("\n--- Low Stock Products (threshold: 10) ---");
    const lowStockProducts = productManager.getLowStockProducts(10);
    lowStockProducts.forEach(product => {
        console.log(product.displayInfo());
    });
    // Demonstrate removing a product
    console.log("\n--- Removing a Product ---");
    productManager.removeProduct(3);
    // Display all products after removal
    productManager.displayAllProducts();
    // Demonstrate error handling
    console.log("\n--- Error Handling ---");
    productManager.updateProductPrice(99, 100); // Non-existent product
    productManager.removeProduct(99); // Non-existent product
}
// Run the demonstration
demonstrateProductManagement();
