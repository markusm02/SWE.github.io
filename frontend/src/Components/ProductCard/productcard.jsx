import React, { useState, useEffect, useRef } from 'react';
import '../../Styles/productCard.css';
import images from '../../Utils/importImages.js';
import axios from 'axios';

const ProductCard = ({ product, onClose, addToCart }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(product.featuredProduct.color || '');
    const [allProducts, setAllProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(product);
    const [imageSrc, setImageSrc] = useState(images[`image_${product.featuredProduct.productID}.jpg`]);
    const overlayRef = useRef(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (selectedColor) {
            const newProduct = allProducts.find(p => p.color === selectedColor && p.productName === product.featuredProduct.productName);
            if (newProduct) {
                setCurrentProduct(newProduct);
            }
        }
    }, [selectedColor, allProducts, product.featuredProduct.productName]);

    useEffect(() => {
        if (currentProduct) {
            setImageSrc(images[`image_${currentProduct.featuredProduct.productID}.jpg`]);
        }
    }, [currentProduct]);

    const handleAddToCart = async () => {
        if (selectedSize && selectedColor) {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    await axios.post('http://localhost:4000/cart/addItem', {
                        customerID: user.customerID,
                        productName: currentProduct.featuredProduct.productName,
                        productID: currentProduct.featuredProduct.productID,
                        quantity: quantity,
                        price: currentProduct.featuredProduct.price,
                        size: selectedSize,
                        color: selectedColor,
                    });
                    alert('Item added to cart');
                    addToCart(currentProduct, selectedSize);
                    onClose();
                } else {
                    alert('Please log in to add items to your cart');
                }
            } catch (error) {
                console.error('Error adding item to cart:', error);
                alert('Could not add item to cart');
            }
        } else {
            alert('Please select a size and color');
        }
    };

    const handleClickOutside = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='product-card-overlay' ref={overlayRef}>
            <div className='product-details'>
            <button className='close-button' onClick={onClose}>×</button>
                {imageSrc ? (
                    <img src={imageSrc} alt={currentProduct.productName} className='product-image' />
                ) : (
                    <p>No image available</p>
                )}
                <h3>{currentProduct.featuredProduct.productName}</h3>
                <p>{currentProduct.featuredProduct.productDescription}</p>
                <p>{currentProduct.featuredProduct.price}</p>
                <div className='size-selection'>
                    <label>Select Size:</label>
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                        <option value=''>Select</option>
                        {currentProduct.featuredProduct.availableStock && Object.keys(currentProduct.featuredProduct.availableStock).map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <div className>

                </div>
                <div className='color-selection'>
                    <label>Select Color:</label>
                    <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                        <option value=''>Select</option>
                        {currentProduct.availableColors && currentProduct.availableColors.map((color, index) => (
                            <option key={index} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
                <div className='quantity-selection'>
                    <label>Quantity:</label>
                    <select 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;