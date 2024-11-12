import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AccountHandling from '../Account/AccountHandling.jsx';
import CartHandler from '../CartHandling/CartHandler.jsx';
import '../../Styles/navbar.css';

const Navbar = ({toggleBlur}) => {
    const [showCart, setShowCart] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const overlayRef = useRef(null);

    const refreshCart = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            try {
                const response = await axios.get(`http://localhost:4000/users/${user.customerID}`);
                setCartItems(response.data.currentCart || []);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        }
    };

    const handleCartClick = async () => {
        setShowCart(!showCart);
        setShowAccount(false);
        toggleBlur(!showCart);

        if (!showCart) {
            await refreshCart();
            
        }
    };

    const handleAccountClick = () => {
        setShowAccount(!showAccount);
        setShowCart(false);
        toggleBlur(!showAccount);
    };

    const handleClickOutside = (event) => {
        if(overlayRef.current && !overlayRef.current.contains(event.target)){
            setShowCart(false);
            setShowAccount(false);
            toggleBlur(false);
        }
    };

    useEffect(() => {
        if (showCart || showAccount) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCart, showAccount]);

    return (
        <div className='navbar'>
            <div className='navbar-content'>
                <div className='company-name'>
                    <Link to="/" className='home-button'>Urban Threads</Link>
                </div>
                <div className='shop-all'>
                    <Link to="/shop" className='shop-now-button'>Shop All</Link>
                </div>
                <div classname='current-cart'>
                    <button className='cart-button' onClick={handleCartClick}>
                        Cart
                    </button>
                </div>
                <div className='account'>
                    <button className='account-button' onClick={handleAccountClick}>
                        Account
                    </button>
                </div>
            </div>
            {(showCart || showAccount) && (
                <div className='overlay' ref={overlayRef}>
                    {showCart && <CartHandler cartItems={cartItems} refreshCart={refreshCart}/>}
                    {showAccount && <AccountHandling toggleBlur={toggleBlur} />}
                </div>
            )}
        </div>
    );

}

export default Navbar;
