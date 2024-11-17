import React, { useState } from 'react';
import ProductCard from '../ProductCard/productCard.jsx';
import images from '../../Utils/importImages.js';
import '../../Styles/carousel.css';

const Carousel = ({ featuredItems, allProducts }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const currentItem = featuredItems.length > 0 ? featuredItems[currentIndex] : null;
  const imageName = currentItem ? `image_${currentItem.featuredProduct.productID}.jpg` : '';
  const imageSrc = images[imageName];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredItems.length) % featuredItems.length);
  };

  const handleItemClick = () => {
    setShowOverlay(true);
  };

  const handleAddToCart = (product, size) => {
    console.log(`Added ${product.productName} of size ${size} to cart`);
  };

  return (
    <div className='carousel'>
      {featuredItems.length > 0 && (
        <>
          <div className='carousel-item' onClick={handleItemClick}>
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt={featuredItems[currentIndex].featuredProduct.productName} 
                className='item-image'
              />
            ) : (
              <div className='placeholder-image'>
                <p>No image available</p>
              </div>
            )}
            <p>{featuredItems[currentIndex].featuredProduct.productName}</p>
          </div>
          <button 
            onClick={handlePrev} 
            className='carousel-button prev' 
            aria-label="Previous item"
          />
          <button 
            onClick={handleNext} 
            className='carousel-button next' 
            aria-label="Next item"
          />
        </>
      )}
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