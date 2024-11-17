import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AllProductsCard from '../Components/ProductCard/allProductsCard.jsx';
import images from '../Utils/importImages.js';
import '../Styles/productCard.css';
import '../Styles/shopAllPage.css';

const ShopAllPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({ category: '', price: '', color: '' });
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [categories, setCategories] = useState([]);
    const [uniqueColors, setUniqueColors] = useState([]);

    const overlayRef = useRef(null);

    const handleClickOutsideOverlay = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            handleCloseCard();
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            document.addEventListener('mousedown', handleClickOutsideOverlay);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideOverlay);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideOverlay);
        };
    }, [selectedProduct]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/all-products');
                setAllProducts(response.data);
                setFilteredProducts(response.data.flatMap(category => category.Products || []));
                const allCategories = response.data.map(category => category.categoryName);
                setCategories([...new Set(allCategories)]);
                const allColors = response.data.flatMap(category => category.availableColors);
                setUniqueColors([...new Set(allColors)]);
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        };
        fetchAllProducts();
    }, []);

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilters({ category: '', price: '', color: '' });
        setFilteredProducts(allProducts.flatMap(category => category.Products || []));
    };

    const handleProductClick = (product) => {
        const category = allProducts.find(cat => cat.Products.some(p => p.productID === product.productID));
        const productWithColors = {
            ...product,
            availableColors: category ? category.availableColors : []
        };
        setSelectedProduct(productWithColors);
    };

    const handleCloseCard = () => {
        setSelectedProduct(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        filterProducts(e.target.value, filters);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        filterProducts(searchTerm, newFilters);
    };

    const filterProducts = (search, filters) => {
        let filtered = allProducts;

        if (search) {
            filtered = filtered.filter(category =>
                category.categoryName.toLowerCase().includes(search.toLowerCase()) ||
                category.Products.some(p => p.productName.toLowerCase().includes(search.toLowerCase())) ||
                category.availableColors.some(color => color.toLowerCase().includes(search.toLowerCase()))
            );
        }

        let flatProducts = filtered.flatMap(category => {
            return (category.Products || []).map(product => ({
                ...product,
                categoryName: category.categoryName
            }));
        });

        if (filters.category) {
            flatProducts = flatProducts.filter(product => product.categoryName === filters.category);
        }

        if (filters.price) {
            if (filters.price === 'high-to-low') {
                flatProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
            } else if (filters.price === 'low-to-high') {
                flatProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
            }
        }

        if (filters.color) {
            flatProducts = flatProducts.filter(product => product.color && product.color.includes(filters.color));
        }

        setFilteredProducts(flatProducts);
    };

    return (
        <div className='shop-all-page'>
            <div className='search-bar'>
                <input
                    type='text'
                    placeholder='Search products, categories, colors...'
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className='filters'>
                <div className='filter-container'>
                    <select 
                        name='category' 
                        onChange={handleFilterChange} 
                        value={filters.category}
                    >
                        <option value=''>All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className='filter-container'>
                    <select 
                        name='price' 
                        onChange={handleFilterChange} 
                        value={filters.price}
                    >
                        <option value=''>Sort by Price</option>
                        <option value='low-to-high'>Price: Low to High</option>
                        <option value='high-to-low'>Price: High to Low</option>
                    </select>
                </div>
                <div className='filter-container'>
                    <select 
                        name='color' 
                        onChange={handleFilterChange} 
                        value={filters.color}
                    >
                        <option value=''>Filter by Color</option>
                        {uniqueColors.map((color, index) => (
                            <option key={index} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleResetFilters}>Reset Filters</button>
            </div>
            <div className='products-grid'>
                {filteredProducts.map(product => (
                    <div 
                        key={product.productID} 
                        className="product-card"
                        onClick={() => handleProductClick(product)}
                    >
                        <img 
                            src={images[product.imageName]} 
                            alt={product.productName} 
                        />
                        <h3>{product.productName}</h3>
                        <p>{product.color}</p>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>
            {selectedProduct && (
                <div className="product-card-overlay" ref={overlayRef}>
                    <div className="product-details">
                        <AllProductsCard
                            product={selectedProduct}
                            onClose={handleCloseCard}
                            addToCart={(product, size) => console.log('Add to cart:', product, size)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopAllPage;