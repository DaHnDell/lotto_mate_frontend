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
import SignupPage from './components/user/SignupPage';
import NotFoundPage from './components/common/NotFoundPage';
import OAuth2CallbackHandler from './components/auth/OAuth2CallbackHandler';
import LottoChartPage from './components/lotto/LottoChartPage';

function App() {
  return (
    <div className="App">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/premium" element={<Premium />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />

          {/* Chart 페이지 */}
          <Route path='/stats/chart' element={<LottoChartPage />} /> 
          
          {/* 로그인 라우트 */}
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth/callback" element={<OAuth2CallbackHandler />} />
          

          {/* 결제 관련 라우트 */}
          <Route path="/subscription/complete" element={<SubscriptionComplete />} />
          <Route path="/mypage/subscription" element={<SubscriptionManage />} />

          {/* 관리자 라우트 */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* 404 페이지 - 모든 라우트 마지막에 위치 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
