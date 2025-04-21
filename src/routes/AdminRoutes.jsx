import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';

// 임시 컴포넌트들
const UsersManagement = () => <div className="p-4"><h2>회원 관리</h2><p>회원 관리 페이지는 준비 중입니다.</p></div>;
const LottoManagement = () => <div className="p-4"><h2>로또 관리</h2><p>로또 관리 페이지는 준비 중입니다.</p></div>;
const SubscriptionManagement = () => <div className="p-4"><h2>구독 관리</h2><p>구독 관리 페이지는 준비 중입니다.</p></div>;
const PaymentManagement = () => <div className="p-4"><h2>결제 관리</h2><p>결제 관리 페이지는 준비 중입니다.</p></div>;
const QnaManagement = () => <div className="p-4"><h2>QnA</h2><p>QnA 페이지는 준비 중입니다.</p></div>;
const NoticeManagement = () => <div className="p-4"><h2>공지 관리</h2><p>공지 관리 페이지는 준비 중입니다.</p></div>;

const AdminRoutes = () => {
  // 관리자 인증 확인 (나중에 구현)
  const isAdmin = true; // 임시로 항상 true로 설정

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="lotto" element={<LottoManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="qna" element={<QnaManagement />} />
        <Route path="notices" element={<NoticeManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;