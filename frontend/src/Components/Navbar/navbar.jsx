import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import '../../Styles/navbar.css';

const Navbar = ({toggleBlur}) => {
    const [showCart, setShowCart] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const overlayRef = useRef(null);

    const handleCartClick = () => {
        setShowCart(!showCart);
        setShowAccount(false);
        // if (showAccount) setShowAccount(false);
        toggleBlur(!showCart);
    };

    const handleAccountClick = () => {
        setShowAccount(!showAccount);
        // if (showCart) setShowCart(false);
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
                    {showCart && <div className='cart-content'>Cart Details</div>}
                    {showAccount && <div className='account-content'>Account Details</div>}
                </div>
            )}
        </div>
    );

}

export default Navbar;
