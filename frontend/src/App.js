import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage'; 
import ProductPage from './Pages/ProductPage';
import Navbar from './Components/Navbar/navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/product/:id' element={<ProductPage />} />
      </Routes>
    </Router>

  );
}

export default App;
