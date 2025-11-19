// Product Listing with API Fetch and Filtering

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const noProductsMessage = document.getElementById('noProductsMessage');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceRangeValue');

// Global products array
let products = [];
let filteredProducts = [];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the products section
    if (productsContainer) {
        loadProducts();
        
        // Event listeners for filters
        categoryFilter.addEventListener('change', applyFilters);
        sortBy.addEventListener('change', applyFilters);
        priceRange.addEventListener('input', function() {
            priceRangeValue.textContent = `$${this.value}`;
            applyFilters();
        });
    }
});

// Fetch products from API
async function loadProducts() {
    showLoading();
    hideError();
    
    try {
        // Using a mock API endpoint
        const response = await fetch('../userstory2/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        products = await response.json();
        filteredProducts = [...products];
        
        hideLoading();
        renderProducts();
        
    } catch (error) {
        console.error('Error fetching products:', error);
        hideLoading();
        showError();
    }
}

// Show loading spinner
function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
    if (productsContainer) {
        productsContainer.innerHTML = '';
    }
}

// Hide loading spinner
function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

// Show error message
function showError() {
    if (errorMessage) {
        errorMessage.classList.remove('d-none');
    }
}

// Hide error message
function hideError() {
    if (errorMessage) {
        errorMessage.classList.add('d-none');
    }
}

// Apply all filters and sorting
function applyFilters() {
    const category = categoryFilter.value;
    const maxPrice = parseInt(priceRange.value);
    const sortOption = sortBy.value;
    
    // Filter by category
    filteredProducts = category === 'all' 
        ? [...products] 
        : products.filter(product => product.category === category);
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    
    // Apply sorting
    switch(sortOption) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default sorting (by ID or as returned from API)
            break;
    }
    
    renderProducts();
}

// Render products to the DOM
function renderProducts() {
    if (!productsContainer) return;
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '';
        if (noProductsMessage) {
            noProductsMessage.classList.remove('d-none');
        }
        return;
    }
    
    if (noProductsMessage) {
        noProductsMessage.classList.add('d-none');
    }
    
    const productsHTML = filteredProducts.map(product => `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <div class="mt-auto">
                        <p class="card-text"><small class="text-muted">Category: ${product.category}</small></p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 text-primary">$${product.price.toFixed(2)}</span>
                            <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                                ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>
                        <button class="btn btn-primary w-100 mt-2" ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    productsContainer.innerHTML = productsHTML;
}