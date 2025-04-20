import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './resources/css/style.css';

import Home from './components/common/Home';
import Premium from './components/premium/Premium';
import SubscriptionComplete from './components/premium/SubscriptionComplete';
import SubscriptionManage from './components/premium/SubscriptionManage';
import MyPage from './components/mypage/MyPage';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<Premium />} />
          <Route path='/mypage' element={<MyPage />} />

          {/* 결제 관련 라우팅 */}
          <Route path="/subscription/complete" element={<SubscriptionComplete />} />
          <Route path="/mypage/subscription" element={<SubscriptionManage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;