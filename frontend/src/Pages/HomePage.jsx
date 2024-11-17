import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from '../Components/Carousel/carousel.jsx';
import CategoryCard from '../Components/CategoryCard/categoryCard.jsx';
import '../Styles/homepage.css';


const HomePage = () => {

  const [featuredItems, setFeaturedItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/featured-products`);
        setFeaturedItems(response.data);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      }
    };
    fetchFeaturedItems();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/all-products');
            setAllProducts(response.data);
        } catch (error) {
            console.error('Error fetching all products:', error);
        }
    };
    fetchAllProducts();
}, []);

  return (
    <div className='home-page'>
      <div className='featured-section'>
        <h2>Featured Items</h2>
        <Carousel featuredItems={featuredItems} allProducts={allProducts}/>
      </div>
      <div className='categories-section'>
        <h2>Categories</h2>
        <div className='category-grid'>
          {allProducts.map((allProducts) => (
            <CategoryCard key={allProducts.categoryID} category={allProducts}/>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomePage;