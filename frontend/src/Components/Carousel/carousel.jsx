import React from 'react';
import Slider from 'react-slick';

const Carousel = ({items}) => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return(
        <Slider {...settings}>
            {items.map((item) => (
                <div key={item.id}>
                    <img src={item.image} alt={item.name} />
                </div>
            ))}
        </Slider>
    );
};

export default Carousel;

