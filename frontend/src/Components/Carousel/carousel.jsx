import React, { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import '../../Styles/carousel.css';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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
          <img
            src={items[currentIndex].image}
            alt={items[currentIndex].productName}
            className='carousel-image'
            onClick={() => handleItemClick(items[currentIndex].productID)}
          />
          <p>{items[currentIndex].productName}</p>
        </div>
      )}
      <button onClick={handlePrev} className='carousel-button'>Previous</button>
      <button onClick={handleNext} className='carousel-button'>Next</button>
    </div>
  );
};

export default Carousel;