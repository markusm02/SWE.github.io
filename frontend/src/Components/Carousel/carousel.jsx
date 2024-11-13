import React, { useState } from 'react';
import ProductCard from '../ProductCard/productcard.jsx';
import images from '../../Utils/importImages.js';
import '../../Styles/carousel.css';

const Carousel = ({ items }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const currentItem = items.length > 0 ? items[currentIndex] : null;
  // Upload images and match with product ID instead of category
  const imageNameTest = currentItem ? `${currentItem.productCategory}.jpg` : '';
  const imageSrc = images[imageNameTest];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleItemClick = (productID) => {
    setShowOverlay(true);
  };

  const handleAddToCart = (product, size) => {
    // Implement add to cart functionality here

    console.log(`Added ${product.productName} of size ${size} to cart`);
  };
  console.log('Current Item:', currentItem);

  return (
    <div className='carousel'>
      {items.length > 0 && (
        <div className='carousel-item'>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={items[currentIndex].productName} 
              className='item-image'
              onClick={handleItemClick}
            />
          ):(
            <p>No image found</p>
          )}
          <p>{items[currentIndex].productName}</p>
        </div>
      )}
      <button onClick={handlePrev} className='carousel-button'>Previous</button>
      <button onClick={handleNext} className='carousel-button'>Next</button>
      {showOverlay && currentItem && (
        <ProductCard 
          product={{ ...currentItem, imageSrc }} 
          onClose={() => setShowOverlay(false)} 
          addToCart={handleAddToCart}
                />
            )}
    </div>
  );
};

export default Carousel;