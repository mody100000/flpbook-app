import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Book from './pages/BookContainer/BookContainer';

function App() {
  const [showCartModal, setShowCartModal] = useState(false);

  return (
    <Router basename="/">
      <div className="App">
        <Book setShowCartModal={setShowCartModal} showCartModal={showCartModal} />
      </div>
    </Router>
  );
}

export default App;