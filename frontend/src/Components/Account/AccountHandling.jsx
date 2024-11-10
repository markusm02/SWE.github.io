import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountHandling = ({ toggleBlur }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
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

    return (
        <div>
            {isLoggedIn ? (
                <div className='account-info'>
                    <h3>Welcome, {user?.firstName} {user?.lastName}</h3>
                    <p>Username: {user?.username}</p>
                    <p>Address:</p>
                    <p>{user?.addresses[0].streetAddress}, {user?.addresses[0].city}, {user?.addresses[0].state}, {user?.addresses[0].zipCode}</p>
                    {/* Add more user details as needed */}
                    <button onClick={handleLogout}>Logout</button>
                    <button>Edit Account</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => setShowLoginForm(true)}>Login</button>
                    <button onClick={handleCreateAccount}>Create Account</button>
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