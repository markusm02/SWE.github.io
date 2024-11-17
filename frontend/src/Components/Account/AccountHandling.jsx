import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/AccountHandling.css';

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
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditExpanded, setIsEditExpanded] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (password) {
            setShowPasswordConfirm(true);
        } else {
            setShowPasswordConfirm(false);
            setConfirmPassword('');
        }
    }, [password]);

    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users/');
            const users = response.data;
            const user = users.find(u => u.username === username && u.passwordHash === password);

            if (user) {
                const userData = await axios.get(`http://localhost:4000/users/${user.customerID}`);
                clearFormFields();
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
        clearFormFields();
        localStorage.removeItem('user');
    };

    const handleCreateAccount = async () => {
        try {
            if (!firstName || !lastName || !username || !password || 
                !streetAddress || !city || !state || !zipCode) {
                setError('All fields are required');
                return;
            }

            const newUser = {
                firstName,
                lastName,
                username,
                passwordHash: password,
                addresses: [{
                    streetAddress,
                    city,
                    state,
                    zipCode,
                    country: 'USA'
                }]
            };

            const response = await axios.post('http://localhost:4000/users/createUser', newUser);
            
            if (response.data) {
                setUser(response.data);
                setIsLoggedIn(true);
                setShowCreateAccountForm(false);
                localStorage.setItem('user', JSON.stringify(response.data));
                setError('');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setError(error.response?.data?.message || 'Error creating account');
        }
    };

    const handleEditAccount = () => {
        if (!isEditExpanded) {
            if (user) {
                setFirstName(user.firstName || '');
                setLastName(user.lastName || '');
                setUsername(user.username || '');
                if (user.addresses && user.addresses[0]) {
                    setStreetAddress(user.addresses[0].streetAddress || '');
                    setCity(user.addresses[0].city || '');
                    setState(user.addresses[0].state || '');
                    setZipCode(user.addresses[0].zipCode || '');
                    setCountry(user.addresses[0].country || '');
                }
            }
            setPassword('');
            setConfirmPassword('');
            setShowPasswordConfirm(false);
        }
        setIsEditExpanded(!isEditExpanded);
        setShowEditAccountForm(!isEditExpanded);
    };

    const handleUpdateAccount = async () => {
        try {
            if (password && password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (username && username !== user.username) {
                const response = await axios.get('http://localhost:4000/users/');
                const users = response.data;
                const usernameExists = users.some(u => u.username === username && u.customerID !== user.customerID);
                
                if (usernameExists) {
                    setError('Username already exists');
                    return;
                }
            }

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
                passwordHash: password || user.passwordHash,
            };

            const response = await axios.put('http://localhost:4000/user/updateUser', updatedUser);
            setUser(updatedUser);
            setShowEditAccountForm(false);
            setIsEditExpanded(false);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert(response.data.message);
            setError('');
            setFirstName('');
            setLastName('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setStreetAddress('');
            setCity('');
            setState('');
            setZipCode('');
        } catch (error) {
            console.error('Error updating account:', error);
            setError(error.response?.data?.message || 'An error occurred while updating account');
        }
    };

    const clearFormFields = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setStreetAddress('');
        setCity('');
        setState('');
        setZipCode('');
        setCountry('');
        setShowPasswordConfirm(false);
        setIsEditExpanded(false);
        setShowEditAccountForm(false);
    };

    return (
        <div className="account-handler">
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
                    <div className="account-options">
                        <button onClick={handleLogout}>Logout</button>
                        <button onClick={handleEditAccount}>
                            {isEditExpanded ? 'Collapse' : 'Edit Account'}
                        </button>
                    </div>

                    {showEditAccountForm && (
                        <div className={`edit-account-form ${isEditExpanded ? 'expanded' : ''}`}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder={user.firstName}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder={user.lastName}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder={user.username}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password (optional)</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            {showPasswordConfirm && (
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type="text"
                                    placeholder={user.addresses[0]?.streetAddress}
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    placeholder={user.addresses[0]?.city}
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    placeholder={user.addresses[0]?.state}
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    placeholder={user.addresses[0]?.zipCode}
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />
                            </div>
                            <button onClick={handleUpdateAccount}>Update Account</button>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {!showLoginForm && !showCreateAccountForm && (
                        <div className="account-options">
                            <button onClick={() => setShowLoginForm(true)}>Login</button>
                            <button onClick={() => setShowCreateAccountForm(true)}>Create Account</button>
                        </div>
                    )}

                    {showCreateAccountForm && (
                        <div className='create-account-form'>
                            <h3>Create Account</h3>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder='First Name'
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder='Last Name'
                                />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type='text'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder='Username'
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                />
                            </div>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type='text'
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                    placeholder='Street Address'
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type='text'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder='City'
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type='text'
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder='State'
                                />
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input
                                    type='text'
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    placeholder='Zip Code'
                                />
                            </div>
                            <div className="create-account-buttons">
                                <button onClick={handleCreateAccount}>Create Account</button>
                                <button onClick={() => {
                                    setShowCreateAccountForm(false);
                                    setError('');
                                }}>Cancel</button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
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
                </div>
            )}
        </div>
    );
};

export default AccountHandling;