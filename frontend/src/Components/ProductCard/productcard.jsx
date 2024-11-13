import React, { useState, useEffect, useRef } from 'react';
import '../../Styles/productCard.css';
import axios from 'axios';

const ProductCard = ({ product, onClose, addToCart }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const overlayRef = useRef(null);

    const handleAddToCart = async () => {
        if (selectedSize && selectedColor) {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    await axios.post('http://localhost:4000/cart/addItem', {
                        customerID: user.customerID,
                        productName: product.productName,
                        productID: product.productID,
                        quantity: 1, // Assuming 1 for simplicity
                        price: product.price, // Assuming price is part of the product object
                        size: selectedSize,
                        color: selectedColor,
                    });
                    alert('Item added to cart');
                    addToCart(product, selectedSize);
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
                {product.imageSrc ? (
                    <img src={product.imageSrc} alt={product.productName} className='product-image' />
                ) : (
                    <p>No image available</p>
                )}
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>{product.price}</p>
                <div className='size-selection'>
                    <label>Select Size:</label>
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                        <option value=''>Select</option>
                        {product.availableStock && Object.keys(product.availableStock).map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <div className='color-selection'>
                    <label>Select Color:</label>
                    <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                        <option value=''>Select</option>
                        {product.availableColors && product.availableColors.map((color, index) => (
                            <option key={index} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;