import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  People, 
  Bullseye, 
  CreditCard, 
  CashCoin, 
  ChatSquareText, 
  Bell, 
  List, 
  X 
} from 'react-bootstrap-icons';
import logo from '/img/logo3.png';
import '../../resources/css/admin-style.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="admin-layout">
      {/* 사이드바 */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo-container">
            <img src={logo} alt="로고" className="sidebar-logo" />
            {!collapsed && <span className="sidebar-logo-text">로또메이트</span>}
          </Link>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {collapsed ? <List size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item active">
              <Link to="/admin" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <Bullseye size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">대시보드</span>}
              </Link>
            </li>
            
            <li className="sidebar-menu-item">
              <Link to="/admin/users" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <People size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">회원 관리</span>}
              </Link>
            </li>
            
            <li className="sidebar-menu-item">
              <Link to="/admin/lotto" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <Bullseye size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">로또 관리</span>}
              </Link>
            </li>
            
            <li className="sidebar-menu-item">
              <Link to="/admin/subscriptions" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <CreditCard size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">구독 관리</span>}
              </Link>
            </li>
            
            <li className="sidebar-menu-item">
              <Link to="/admin/payments" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <CashCoin size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">결제 관리</span>}
              </Link>
            </li>
            
            <li className="sidebar-menu-item">
              <Link to="/admin/qna" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <ChatSquareText size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">QnA</span>}
              </Link>
            </li>
            
            <li className="sidebar-menu-item">
              <Link to="/admin/notices" className="sidebar-menu-link">
                <span className="sidebar-menu-icon">
                  <Bell size={18} />
                </span>
                {!collapsed && <span className="sidebar-menu-text">공지 관리</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">관리자</div>
              <div className="sidebar-user-role">시스템 관리자</div>
            </div>
          )}
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className={`admin-main ${collapsed ? 'expanded' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;