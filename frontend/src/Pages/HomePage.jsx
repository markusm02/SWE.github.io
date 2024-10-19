import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from '../Components/Carousel/carousel.jsx';
import '../Styles/homepage.css';
import test1 from '../resources/ProductImages/test1.jpg';
import test2 from '../resources/ProductImages/test2.jpeg';
import test3 from '../resources/ProductImages/test3.jpg';
import test4 from '../resources/ProductImages/test4.jpg';

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([
    { productID: 1, name: 'Product 1', image: test1 },
    { productID: 2, name: 'Product 2', image: test2 },
    { productID: 3, name: 'Product 3', image: test3 },
    { productID: 4, name: 'Product 4', image: test4 }

  ]);

  // useEffect(() => {
  //   const fetchFeaturedItems = async () => {
  //     try {
  //       const response = await axios.get('https://api.yourdomain.com/products/featured');
  //       setFeaturedItems(response.data);
  //     } catch (error) {
  //       console.error('Error fetching featured items:', error);
  //     }
  //   };
  //   fetchFeaturedItems();
  // }, []);

  return (
    <div className='home-page'>
      <div className='featured-section'>
        <h2>Featured Items</h2>
        <Carousel items={featuredItems} />
      </div>
      <div className='categories-section'>
        <h2>Categories</h2>
        <div className='category-grid'>
          <div className='category-card'>

          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;