import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './resources/css/style.css';

import Home from './components/common/Home';
import Premium from './components/premium/Premium';
import SubscriptionComplete from './components/premium/SubscriptionComplete';
import SubscriptionManage from './components/premium/SubscriptionManage';
import MyPage from './components/mypage/MyPage';
import ProfileEdit from './components/mypage/ProfileEdit';
import AdminRoutes from './routes/AdminRoutes';
import LoginPage from './components/user/LoginPage';

function App() {
  return (
    <div className="App">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<Premium />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          
          {/* 관리자 라우트 */}
          <Route path="/login/*" element={<LoginPage />} />
          
          {/* 결제 관련 라우팅 */}
          <Route path="/subscription/complete" element={<SubscriptionComplete />} />
          <Route path="/mypage/subscription" element={<SubscriptionManage />} />

          {/* 관리자 라우트 */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;