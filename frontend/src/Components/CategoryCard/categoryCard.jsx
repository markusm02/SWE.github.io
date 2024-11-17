import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/categoryCard.css';
import images from '../../Utils/importImages.js';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();
    const imageName = `category_image_${category.categoryID}.jpg`;
    const imageSrc = images[imageName];

    const handleItemClick = () => {
        navigate(`/categories/${category.categoryID}`);
    };

    return (
        <div className='category-card' onClick={handleItemClick}>
            <div className='category-image-container'>
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt={category.categoryName} 
                        className='category-image'
                    />  
                ) : (
                    <p>No image found</p>
                )}
            </div>
            <div className='category-name'>
                <p>{category.categoryName}</p>
            </div>
        </div>
    );
};

export default CategoryCard;



