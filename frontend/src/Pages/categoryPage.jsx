import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Styles/categoryPage.css';
import images from '../Utils/importImages.js';
import AllProductsCard from '../Components/ProductCard/allProductsCard';

const CategoryPage = () => {
    const { categoryID } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/all-products');
                const matchingCategory = response.data.find(
                    category => category.categoryID === parseInt(categoryID, 10)
                );
                
                if (matchingCategory && matchingCategory.Products) {
                    matchingCategory.Products = matchingCategory.Products.map(product => ({
                        ...product,
                        availableColors: matchingCategory.availableColors
                    }));
                }
                
                setCategoryData(matchingCategory);
            } catch (error) {
                console.error('Error fetching category products:', error);
            }
        };
        fetchCategoryProducts();
    }, [categoryID]);

    const handleProductClick = (product) => {
        const productWithColors = {
            ...product,
            availableColors: categoryData.availableColors
        };
        setSelectedProduct(productWithColors);
    };

    const handleCloseOverlay = () => {
        setSelectedProduct(null);
    };

    const handleAddToCart = (product, size) => {
        // Handle add to cart functionality
        console.log('Added to cart:', product, size);
    };

    if (!categoryData) return <div>Loading...</div>;

    return (
        <div className="category-page">
            <h1>{categoryData.categoryName}</h1>
            <div className="products-grid">
                {categoryData.Products && categoryData.Products.map((product) => (
                    <div 
                        key={product.productID} 
                        className="product-card"
                        onClick={() => handleProductClick(product)}
                    >
                        <img 
                            src={images[product.imageName]} 
                            alt={product.productName} 
                            className="product-image"
                        />
                        <h3>{product.productName}</h3>
                        <p>Color: {product.color}</p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <AllProductsCard
                    product={selectedProduct}
                    onClose={handleCloseOverlay}
                    addToCart={handleAddToCart}
                />
            )}
        </div>
    );
};

export default CategoryPage;