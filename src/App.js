import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom'; 
import Home from './Home'; 
import Book from './Book';

function App() {
  return (

    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Book />} />
      </Routes>
    </Router>
  );
}

export default App;
