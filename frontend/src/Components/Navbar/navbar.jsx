import React from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/navbar.css';

const Navbar = () => {

    return (
        <nav className='navbar'> 
            <div className='navbar-content'>
                <div className='company-name'>
                    <Link to="/" className='home-button'>Urban Threads</Link>
                </div>
                <div className='shop-all'>
                    <Link to="/shop" className='shop-now-button'>Shop Now</Link>
                </div>
                <div className='current-cart'>
                    <Link to="/cart" className='cart-button'>Cart</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
