import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/categoryCard.css';
import images from '../../Utils/importImages.js';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();
    const imageName = `${category}.jpg`;
    const imageSrc = images[imageName];

    const handleItemClick = (category) => {
        navigate(`/categories/${category}`);
      };


  return (
    <div className='category-card'>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={category} 
            className='category-image' 
            onClick={() => handleItemClick(category)}
          />  
        ): (
            <p>No image found</p>
        )}
      <p>{category}</p>
    </div>
  );
};

export default CategoryCard;



