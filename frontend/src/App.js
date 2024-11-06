import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage'; 
import ProductPage from './Pages/ProductPage';
import Navbar from './Components/Navbar/navbar';

function App() {
  const [isBlurred, setIsBlurred] = useState(false);
  const toggleBlur = (shouldBlur) => setIsBlurred(shouldBlur);
  return (
    <Router>
      <Navbar toggleBlur={toggleBlur}/>
      <div className={isBlurred ? 'blur-background' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
