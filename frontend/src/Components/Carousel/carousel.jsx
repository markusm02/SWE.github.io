import React from 'react';
import Slider from 'react-slick';
import '../../Styles/carousel.css';

const Carousel = ({ items }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: '0px',
  };

  return (
    <Slider {...settings}>
      {items.map(item => (
        <div key={item.productID} className='carousel-item'>
          <img
            src={item.image}
            alt={item.name}
            className='carousel-image'
          />
          <p>{item.name}</p>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;