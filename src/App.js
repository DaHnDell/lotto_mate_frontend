import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './resources/css/style.css';

import Home from './components/common/Home';
import Premium from './components/premium/Premium';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/premium" element={<Premium />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;