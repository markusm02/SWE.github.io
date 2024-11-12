import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountHandling = ({ toggleBlur }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
    const [showEditAccountForm, setShowEditAccountForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
            // Initialize form fields with existing user data
            setFirstName(parsedUser.firstName || '');
            setLastName(parsedUser.lastName || '');
            setUsername(parsedUser.username || '');
            if (parsedUser.addresses && parsedUser.addresses[0]) {
                setStreetAddress(parsedUser.addresses[0].streetAddress || '');
                setCity(parsedUser.addresses[0].city || '');
                setState(parsedUser.addresses[0].state || '');
                setZipCode(parsedUser.addresses[0].zipCode || '');
                setCountry(parsedUser.addresses[0].country || '');
            }
        }
    }, []);


    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users/');
            const users = response.data;
            const user = users.find(u => u.username === username && u.passwordHash === password);

            if (user) {
                const userData = await axios.get(`http://localhost:4000/users/${user.customerID}`);
                setUser(userData.data);
                setIsLoggedIn(true);
                setShowLoginForm(false);
                setError('');
                localStorage.setItem('user', JSON.stringify(userData.data));
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred during login');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    };

    const handleCreateAccount = () => {
        setShowCreateAccountForm(true);
        setShowLoginForm(false);
    };

    const handleEditAccount = () => {
        setShowEditAccountForm(true);
    };

    const handleUpdateAccount = async () => {
        try {
            const updatedUser = {
                customerID: user.customerID,
                addresses: [{
                    streetAddress: streetAddress || user.addresses[0].streetAddress,
                    city: city || user.addresses[0].city,
                    state: state || user.addresses[0].state,
                    zipCode: zipCode || user.addresses[0].zipCode,
                    country: country || user.addresses[0].country,
                }],
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                username: username || user.username,
                passwordHash: password || user.passwordHash, // Use existing password if not changed
            };

            const response = await axios.put('http://localhost:4000/user/updateUser', updatedUser);
            setUser(updatedUser);
            setShowEditAccountForm(false);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating account:', error);
            setError('An error occurred while updating account');
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <div className='account-info'>
                    <h3>Welcome, {user?.firstName} {user?.lastName}</h3>
                    <p>Username: {user?.username}</p>
                    <p>Address:</p>
                    {user?.addresses && user.addresses[0] ? (
                        <p>{user.addresses[0].streetAddress}, {user.addresses[0].city}, {user.addresses[0].state}, {user.addresses[0].zipCode}</p>
                    ) : (
                        <p>No address available</p>
                    )}
                    {/* Add more user details as needed */}
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleEditAccount}>Edit Account</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => setShowLoginForm(true)}>Login</button>
                    <button onClick={handleCreateAccount}>Create Account</button>
                </div>
            )}

            {showEditAccountForm && (
                <div className='edit-account-form'>
                    <h3>Edit Account</h3>
                    <input
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Street Address'
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='State'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Zip Code'
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <button onClick={handleUpdateAccount}>Update Account</button>
                    {error && <p className='error'>{error}</p>}
                </div>
            )}

            {showLoginForm && (
                <div className='login-form'>
                    <h3>Login Form</h3>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    {error && <p className='error'>{error}</p>}
                </div>
            )}

            {showCreateAccountForm && (
                <div className='create-account-form'>
                    {/* Implement create account form here */}
                    <h3>Create Account Form</h3>
                    <input type='text' placeholder='First Name' />
                    <input type='text' placeholder='Last Name' />
                    <input type='text' placeholder='Username' />
                    <input type='password' placeholder='Password' />
                    <button>Create Account</button>
                </div>
            )}
        </div>
    );
};

export default AccountHandling;