// Product Management Module using TypeScript

// Interface for Product
interface IProduct {
    id: number;
    name: string;
    category: ProductCategory;
    price: number;
    stock: number;
}

// Enum for Product Categories
enum ProductCategory {
    ELECTRONICS = "Electronics",
    CLOTHING = "Clothing",
    HOME = "Home & Kitchen",
    BOOKS = "Books",
    SPORTS = "Sports"
}

// Type for Product Map
type ProductMap = Map<number, IProduct>;

// Decorator to log changes in price or stock
function LogChanges(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        const product = this as Product;
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
class Product implements IProduct {
    constructor(
        public id: number,
        public name: string,
        public category: ProductCategory,
        public price: number,
        public stock: number
    ) {}
    
    // Method to update price with decorator
    @LogChanges
    updatePrice(newPrice: number): void {
        if (newPrice >= 0) {
            this.price = newPrice;
        } else {
            console.error("Price cannot be negative");
        }
    }
    
    // Method to update stock with decorator
    @LogChanges
    updateStock(newStock: number): void {
        if (newStock >= 0) {
            this.stock = newStock;
        } else {
            console.error("Stock cannot be negative");
        }
    }
    
    // Display product information
    displayInfo(): string {
        return `[#${this.id}] ${this.name} - ${this.category} - $${this.price} (Stock: ${this.stock})`;
    }
}

// ProductManager Class to handle product operations
class ProductManager {
    private products: ProductMap = new Map<number, IProduct>();
    
    // Add a product to the manager
    addProduct(product: Product): void {
        this.products.set(product.id, product);
        console.log(`Added product: ${product.name}`);
    }
    
    // Get a product by ID
    getProduct(id: number): Product | undefined {
        return this.products.get(id) as Product;
    }
    
    // Update product price
    updateProductPrice(id: number, newPrice: number): boolean {
        const product = this.getProduct(id);
        if (product) {
            product.updatePrice(newPrice);
            return true;
        }
        console.error(`Product with ID ${id} not found`);
        return false;
    }
    
    // Update product stock
    updateProductStock(id: number, newStock: number): boolean {
        const product = this.getProduct(id);
        if (product) {
            product.updateStock(newStock);
            return true;
        }
        console.error(`Product with ID ${id} not found`);
        return false;
    }
    
    // Remove a product
    removeProduct(id: number): boolean {
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
    getAllProducts(): IProduct[] {
        return Array.from(this.products.values());
    }
    
    // Display all products
    displayAllProducts(): void {
        console.log("\n--- All Products ---");
        if (this.products.size === 0) {
            console.log("No products available");
            return;
        }
        
        // Using for...of to iterate over the Map
        for (const [id, product] of this.products) {
            console.log((product as Product).displayInfo());
        }
    }
    
    // Get products by category
    getProductsByCategory(category: ProductCategory): IProduct[] {
        const result: IProduct[] = [];
        
        // Using for...of to iterate
        for (const product of this.products.values()) {
            if (product.category === category) {
                result.push(product);
            }
        }
        
        return result;
    }
    
    // Get low stock products (stock less than threshold)
    getLowStockProducts(threshold: number = 10): IProduct[] {
        const result: IProduct[] = [];
        
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
function demonstrateProductManagement(): void {
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
        console.log((product as Product).displayInfo());
    });
    
    // Demonstrate getting low stock products
    console.log("\n--- Low Stock Products (threshold: 10) ---");
    const lowStockProducts = productManager.getLowStockProducts(10);
    lowStockProducts.forEach(product => {
        console.log((product as Product).displayInfo());
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