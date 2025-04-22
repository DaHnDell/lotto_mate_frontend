import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Person, CreditCard, FileText, LockFill, Bell, ClockHistory } from 'react-bootstrap-icons';

const Sidebar = ({ activeTab, handleTabChange, handleLogout }) => {
  return (
    <div className="mypage-sidebar">
      <Nav className="flex-column mypage-nav">
        <Nav.Link 
          className={`mypage-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <Person className="icon me-2" /> 프로필 정보
        </Nav.Link>
        
        <Nav.Link 
          className={`mypage-nav-item ${activeTab === 'subscription' ? 'active' : ''}`}
          onClick={() => handleTabChange('subscription')}
        >
          <CreditCard className="icon me-2" /> 구독 관리
        </Nav.Link>
        
        <Nav.Link 
          className={`mypage-nav-item ${activeTab === 'numbers' ? 'active' : ''}`}
          onClick={() => handleTabChange('numbers')}
        >
          <FileText className="icon me-2" /> 내 번호 관리
        </Nav.Link>
        
        <Nav.Link 
          className={`mypage-nav-item ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => handleTabChange('security')}
        >
          <LockFill className="icon me-2" /> 보안 설정
        </Nav.Link>
        
        <Nav.Link 
          className={`mypage-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => handleTabChange('notifications')}
        >
          <Bell className="icon me-2" /> 알림 설정
        </Nav.Link>
        
        <Nav.Link 
          className={`mypage-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          <ClockHistory className="icon me-2" /> 이용 내역
        </Nav.Link>
      </Nav>
      
      <div className="mt-4">
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="w-100"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;