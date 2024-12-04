import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage'; 
import Navbar from './components/Navbar/navbar';
import ShopAllPage from './Pages/shopAllPage';
import CategoryPage from './Pages/categoryPage';

function App() {
  const [isBlurred, setIsBlurred] = useState(false);
  const toggleBlur = (shouldBlur) => setIsBlurred(shouldBlur);
  return (
    <Router>
      <Navbar toggleBlur={toggleBlur}/>
      <div className={isBlurred ? 'blur-background' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop-all" element={<ShopAllPage />} />
          <Route path="/categories/:categoryID" element={<CategoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
