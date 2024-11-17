import React, { useState, useEffect } from 'react';
import '../../Styles/CartHandler.css';
import axios from 'axios';

const CartHandler = ({ cartItems, refreshCart }) => {
    const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [shippingOption, setShippingOption] = useState('regular');
    const [totalCost, setTotalCost] = useState(0);
    const [user, setUser] = useState(null);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const [discountError, setDiscountError] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardError, setCardError] = useState('');
    const [isPurchaseExpanded, setIsPurchaseExpanded] = useState(false);

    const TAX_RATE = 0.0825;
    const EXPRESS_SHIPPING_COST = 8.00;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const calculateTotal = () => {
            let subtotal = cartItems.reduce((acc, item) => {
                return acc + (item.price * item.quantity);
            }, 0);
            let tax = subtotal * TAX_RATE;
            let shippingCost = shippingOption === 'express' ? EXPRESS_SHIPPING_COST : 0;
            let discount = isDiscountApplied && discountCode === 'newcustomer' ? 
                0.1 * (subtotal + tax + shippingCost) : 0;
            return subtotal + tax + shippingCost - discount;
        };
        setTotalCost(calculateTotal());
    }, [cartItems, shippingOption, discountCode, isDiscountApplied]);

    const handleRemoveItem = async (productID) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            try {
                await axios.post('http://localhost:4000/cart/removeItem', {
                    customerID: user.customerID,
                    productID,
                });
                refreshCart();
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        }
    };

    const handleApplyDiscountCode = () => {
        if (discountCode === 'newcustomer') {
            setIsDiscountApplied(true);
            setDiscountError('');
            alert('Discount code applied successfully!');
        } else {
            setIsDiscountApplied(false);
            setDiscountError('Invalid discount code');
        }
    };

    const handlePurchase = () => {
        if (user && cartItems.length > 0) {
            setIsPurchaseExpanded(!isPurchaseExpanded);
            setShowPurchaseOverlay(!isPurchaseExpanded);
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setCardNumber(value);
            setCardError('');
        }
    };

    const completePurchase = async () => {
        if (!cardNumber) {
            setCardError('Please enter a card number');
            return;
        }

        if (!/^\d+$/.test(cardNumber)) {
            setCardError('Card number must contain only numbers');
            return;
        }

        if (user) {
            try {
                await axios.post('http://localhost:4000/cart/purchase', {
                    customerID: user.customerID,
                });
                alert(`Thank you for your purchase! Total cost: $${totalCost.toFixed(2)}. Your items should arrive in ${shippingOption === 'express' ? '3' : '5'} days.`);
                refreshCart();
                setShowPurchaseOverlay(false);
                setCardNumber('');
                setCardError('');
            } catch (error) {
                console.error('Error during purchase:', error);
            }
        }
    };

    return (
        <div className='cart-handler'>
            <h3>Your Cart</h3>
            {cartItems.length > 0 ? (
                <>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index} className='cart-item'>
                                <p className='item-name'>{item.productName}</p>
                                <p className='item-size'>Size: {item.size}</p>
                                <p className='item-color'>Color: {item.color}</p>
                                <p className='item-price'>Price: ${item.price}</p>
                                <p className='item-quantity'>Quantity: {item.quantity}</p>
                                <button className='remove-button' onClick={() => handleRemoveItem(item.productID)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className='purchase-button' onClick={handlePurchase}>
                        {isPurchaseExpanded ? 'Collapse' : 'Purchase'}
                    </button>
                </>
            ) : (
                <p className='empty-cart'>Your cart is empty.</p>
            )}
            
            {showPurchaseOverlay && user && (
                <div className={`purchase-overlay ${isPurchaseExpanded ? 'expanded' : ''}`}>
                    <h3>Purchase Summary</h3>
                    <p className='total-cost'>Total Cost: ${totalCost.toFixed(2)}</p>
                    <p className='shipping-address'>
                        Shipping Address: {user.addresses[0].streetAddress}, {user.addresses[0].city}, {user.addresses[0].state}, {user.addresses[0].zipCode}
                    </p>
                    
                    <div className='discount-section'>
                        <input
                            type='text'
                            placeholder='Discount Code'
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                        />
                        <button onClick={handleApplyDiscountCode}>Apply Code</button>
                        {discountError && <p className='discount-error'>{discountError}</p>}
                    </div>

                    <div className='card-input-section'>
                        <input
                            type='text'
                            placeholder='Card Number'
                            className={`card-input ${cardError ? 'error' : ''}`}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={16}
                        />
                        {cardError && <p className='card-error'>{cardError}</p>}
                    </div>

                    <div className='shipping-options'>
                        <label>
                            <input
                                type='radio'
                                value='regular'
                                checked={shippingOption === 'regular'}
                                onChange={() => setShippingOption('regular')}
                            />
                            Regular (5 days) Free
                        </label>
                        <label>
                            <input
                                type='radio'
                                value='express'
                                checked={shippingOption === 'express'}
                                onChange={() => setShippingOption('express')}
                            />
                            Express (3 days) + $8.00
                        </label>
                    </div>

                    <button className='complete-purchase-button' onClick={completePurchase}>
                        Complete Purchase
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartHandler;