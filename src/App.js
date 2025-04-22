import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './resources/css/style.css';

import Home from './components/common/Home';

function App() {
  return (
    <div className="App">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default App;