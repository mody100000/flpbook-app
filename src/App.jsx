import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Book from './pages/BookContainer/BookContainer';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Navbar />
        <Book />
      </div>
    </Router>
  );
}

export default App;