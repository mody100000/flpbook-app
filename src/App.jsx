import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Book from './pages/BookContainer/BookContainer';
import { CartProvider } from './context/CartContext';

function App() {
  const [showCartModal, setShowCartModal] = useState(false);

  return (
    <Router basename="/">
      <div className="App">
        <CartProvider>
          <Book setShowCartModal={setShowCartModal} showCartModal={showCartModal} />
        </CartProvider>
      </div>
    </Router>
  );
}

export default App;