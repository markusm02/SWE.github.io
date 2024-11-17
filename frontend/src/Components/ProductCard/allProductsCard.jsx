import React, { useState, useEffect, useRef } from 'react';
import images from '../../Utils/importImages.js'; 
import '../../Styles/productCard.css';
import axios from 'axios';

const AllProductsCard = ({ product, onClose, addToCart }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(product.color || '');
    const [currentProduct, setCurrentProduct] = useState(product);
    const [imageSrc, setImageSrc] = useState(images[product.imageName]);
    const overlayRef = useRef(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (selectedColor && product.variants) {
            const newProduct = product.variants.find(p => p.color === selectedColor);
            if (newProduct) {
                setCurrentProduct(newProduct);
            }
        }
    }, [selectedColor, product.variants]);

    useEffect(() => {
        if (currentProduct) {
            setImageSrc(images[currentProduct.imageName]);
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
                        productName: currentProduct.productName,
                        productID: currentProduct.productID,
                        quantity: quantity,
                        price: currentProduct.price,
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

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    return (
        <div className='product-card-overlay' ref={overlayRef}>
            <div className='product-details'>
                <button className='close-button' onClick={onClose}>×</button>
                {imageSrc ? (
                    <img src={imageSrc} alt={currentProduct.productName} className='product-image' />
                ) : (
                    <p>No image available</p>
                )}
                <h3>{currentProduct.productName}</h3>
                <p>{currentProduct.productDescription}</p>
                <p>{currentProduct.price}</p>
                <div className='size-selection'>
                    <label>Select Size:</label>
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                        <option value=''>Select</option>
                        {currentProduct.availableStock && Object.keys(currentProduct.availableStock).map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <div className='color-selection'>
                    <label>Select Color:</label>
                    <select value={selectedColor} onChange={handleColorChange}>
                        <option value=''>Select</option>
                        {product.availableColors && product.availableColors.map((color, index) => (
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

export default AllProductsCard;