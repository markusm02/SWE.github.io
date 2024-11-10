import React, { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import images from '../../Utils/importImages.js';
import '../../Styles/carousel.css';

const Carousel = ({ items }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
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
    navigate(`/products/${productID}`);
  };

  return (
    <div className='carousel'>
      {items.length > 0 && (
        <div className='carousel-item'>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={items[currentIndex].productName} 
              className='item-image'
              onClick={() => handleItemClick(items[currentIndex].productID)}
            />
          ):(
            <p>No image found</p>
          )}
          <p>{items[currentIndex].productName}</p>
        </div>
      )}
      <button onClick={handlePrev} className='carousel-button'>Previous</button>
      <button onClick={handleNext} className='carousel-button'>Next</button>
    </div>
  );
};

export default Carousel;