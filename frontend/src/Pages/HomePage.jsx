import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from '../Components/Carousel/carousel.jsx';
import CategoryCard from '../Components/CategoryCard/categoryCard.jsx';
import '../Styles/homepage.css';


const HomePage = () => {

  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/products`);
        setFeaturedItems(response.data);

        const uniqueCategories = [...new Set(response.data.map(item => item.productCategory))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      }
    };
    fetchFeaturedItems();
  }, []);
  console.log('featuredItems');
  console.log(featuredItems);
  console.log(categories);

  return (
    <div className='home-page'>
      <div className='featured-section'>
        <h2>Featured Items</h2>
        <Carousel items={featuredItems} />
      </div>
      <div className='categories-section'>
        <h2>Categories</h2>
        <div className='category-grid'>
          {categories.map((category) => (
            <CategoryCard key={category} category={category}/>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomePage;