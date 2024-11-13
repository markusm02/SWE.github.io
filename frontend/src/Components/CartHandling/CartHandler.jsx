import React, { useState, useEffect } from 'react';
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
            let subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            let tax = subtotal * TAX_RATE;
            let shippingCost = shippingOption === 'express' ? EXPRESS_SHIPPING_COST : 0;
            let discount = isDiscountApplied && discountCode === 'newcustomer' ? 0.1 * (subtotal + tax + shippingCost) : 0;
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
                refreshCart(); // Refresh cart immediately after removing item
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        }
    };

    const handleApplyDiscountCode = () => {
        if (discountCode === 'newcustomer') {
            setIsDiscountApplied(true);
            setDiscountError('');
            alert('Discount code applied');
        } else {
            setIsDiscountApplied(false);
            alert('Invalid code');
        }
    };

    const handlePurchase = () => {
        if (user && cartItems.length > 0) {
            setShowPurchaseOverlay(true);
        }
    };

    const completePurchase = async () => {
        if (user) {
            try {
                await axios.post('http://localhost:4000/cart/purchase', {
                    customerID: user.customerID,
                });
                alert(`Thank you for your purchase! Total cost: $${totalCost.toFixed(2)}. Your items should arrive in ${shippingOption === 'express' ? '3' : '5'} days.`);
                refreshCart();
                setShowPurchaseOverlay(false);
            } catch (error) {
                console.error('Error during purchase:', error);
            }
        }
    };

    return (
        <div className='cart-handler'>
            <h3>Your Cart</h3>
            {cartItems.length > 0 ? (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            <p>{item.productName}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                            <p>Color: {item.color}</p>
                            <p>Price: ${item.price}</p>
                            <button onClick={() => handleRemoveItem(item.productID)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            {cartItems.length > 0 && (
                <button onClick={handlePurchase}>Purchase</button>
            )}

            {showPurchaseOverlay && user && (
                <div className='purchase-overlay'>
                    <h3>Purchase Summary</h3>
                    <p>Total Cost: ${totalCost.toFixed(2)}</p>
                    <p>Shipping Address: {user.addresses[0].streetAddress}, {user.addresses[0].city}, {user.addresses[0].state}, {user.addresses[0].zipCode}</p>
                    <input
                        type='text'
                        placeholder='Discount Code'
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button onClick={handleApplyDiscountCode}>Apply Code</button>
                    {discountError && <p className='error'>{discountError}</p>}
                    <input
                        type='text'
                        placeholder='Card Number'
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <div>
                        <label>
                            <input
                                type='radio'
                                value='regular'
                                checked={shippingOption === 'regular'}
                                onChange={() => setShippingOption('regular')}
                            />
                            Regular (5 days)
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
                    <button onClick={completePurchase}>Complete Purchase</button>
                </div>
            )}
        </div>
    );
};

export default CartHandler;