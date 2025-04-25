import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from './Sidebar';
import ProfileTab from './ProfileTab';
import SubscriptionTab from './SubscriptionTab';
import NumbersTab from './NumbersTab';
import SecurityTab from './SecurityTab';
import NotificationsTab from './NotificationsTab';
import HistoryTab from './HistoryTab';
import { useAuth } from '../../hooks/AuthContext';
import '../../resources/css/style.css';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [userNumbers, setUserNumbers] = useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { email, logout } = useAuth(); // 실제 사용하는 값만 구조 분해
  const navigate = useNavigate();
  
  // 사용자 정보 조회
  useEffect(() => {
    // 임시 데이터 객체들 - useEffect 내부에 선언하여 종속성 경고 해결
    const tempUserInfo = {
      id: 1,
      email: 'user@example.com',
      name: '홍길동',
      phone: '010-1234-5678',
      createdAt: '2024-10-15T09:30:00',
      emailVerified: true,
      socialAccounts: {
        kakao: true,
        google: false
      }
    };
    
    const tempSubscriptionInfo = {
      id: 123,
      plan: 'standard',
      period: 'monthly',
      status: 'ACTIVE',
      startDate: '2025-03-15T00:00:00',
      endDate: null,
      nextPaymentDate: '2025-04-15T00:00:00',
      autoRenewal: true,
      price: 9000,
      paymentMethod: {
        id: 1,
        cardName: '신한카드',
        cardNumber: '****-****-****-1234',
        isDefault: true
      },
      recentPayment: {
        id: 456,
        paymentDate: '2025-03-15T10:30:00',
        amount: 9000,
        status: 'COMPLETE',
        receiptUrl: 'https://example.com/receipt/456'
      }
    };
    
    const tempPaymentMethods = [
      {
        id: 1,
        cardName: '신한카드',
        cardNumber: '****-****-****-1234',
        isDefault: true,
        cardExpiry: '12/28'
      },
      {
        id: 2,
        cardName: '국민카드',
        cardNumber: '****-****-****-5678',
        isDefault: false,
        cardExpiry: '09/27'
      }
    ];
    
    const tempUserNumbers = [
      {
        id: 1001,
        name: '행운의 번호',
        drawRound: 1064,
        numbers: '8,13,19,27,40,45',
        isAuto: false,
        createdAt: '2025-04-12T15:30:00'
      },
      {
        id: 1002,
        name: '생일 조합',
        drawRound: 1064,
        numbers: '1,5,12,25,33,42',
        isAuto: false,
        createdAt: '2025-04-13T10:15:00'
      },
      {
        id: 1003,
        name: null,
        drawRound: 1065,
        numbers: '3,9,14,22,31,39',
        isAuto: true,
        createdAt: '2025-04-14T18:45:00'
      }
    ];
  
    // 임시 데이터로 상태 설정 (실제 구현 시에는 API 호출)
    setTimeout(() => {
      setUserInfo(tempUserInfo);
      setSubscriptionInfo(tempSubscriptionInfo);
      setPaymentMethods(tempPaymentMethods);
      setUserNumbers(tempUserNumbers);
      setLoading(false);
    }, 1000); // 로딩 화면 보여주기 위한 딜레이
    
    /* 
    // 실제 API 구현 시 사용할 코드
    const fetchUserInfo = async () => {
      if (!token) {
        navigate('/login', { state: { from: '/mypage' } });
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // 사용자 정보 조회
        const userInfoResponse = await req('GET', 'user/info');
        setUserInfo(userInfoResponse);
        
        // 저장된 로또 번호 조회
        const userNumbersResponse = await req('GET', 'user/numbers');
        setUserNumbers(userNumbersResponse.numbers || []);
        
        // 구독 정보 조회
        try {
          const subscriptionResponse = await req('GET', 'subscription/info');
          setSubscriptionInfo(subscriptionResponse);
        } catch (subError) {
          console.log('구독 정보가 없습니다.');
          setSubscriptionInfo(null);
        }
        
        // 결제 수단 목록 조회
        try {
          const paymentMethodsResponse = await req('GET', 'payment/methods');
          setPaymentMethods(paymentMethodsResponse.methods || []);
        } catch (paymentError) {
          console.log('결제 수단 정보가 없습니다.');
          setPaymentMethods([]);
        }
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
        setError('사용자 정보를 조회하는데 실패했습니다. 다시 로그인해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
    */

    setError(null);
  }, []);
  
  // 탭 변경 처리
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // 구독 상태에 따른 배지 색상 클래스
  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-secondary';
    
    const statusMap = {
      'ACTIVE': 'bg-success',
      'INACTIVE': 'bg-secondary',
      'PENDING': 'bg-warning',
      'CANCELLED': 'bg-danger'
    };
    
    return statusMap[status] || 'bg-secondary';
  };
  
  // 플랜 이름 포맷팅
  const formatPlanName = (plan) => {
    if (!plan) return '-';
    
    const planMap = {
      'basic': 'BASIC',
      'standard': 'STANDARD',
      'premium': 'PREMIUM'
    };
    
    return planMap[plan] || plan.toUpperCase();
  };
  
  // 현재 활성화된 탭 컴포넌트 렌더링
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab userInfo={userInfo} formatDate={formatDate} />;
      case 'subscription':
        return (
          <SubscriptionTab
            subscriptionInfo={subscriptionInfo}
            paymentMethods={paymentMethods}
            formatDate={formatDate}
            getStatusBadgeClass={getStatusBadgeClass}
            formatPlanName={formatPlanName}
          />
        );
      case 'numbers':
        return <NumbersTab userNumbers={userNumbers} formatDate={formatDate} />;
      case 'security':
        return <SecurityTab userInfo={userInfo} />;
      case 'notifications':
        return <NotificationsTab />;
      case 'history':
        return (
          <HistoryTab
            subscriptionInfo={subscriptionInfo}
            userNumbers={userNumbers}
            formatDate={formatDate}
            formatPlanName={formatPlanName}
          />
        );
      default:
        return <ProfileTab userInfo={userInfo} formatDate={formatDate} />;
    }
  };
  
  if (loading) {
    return (
      <div className="mypage">
        <Header />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">사용자 정보를 불러오고 있습니다...</p>
        </Container>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mypage">
        <Header />
        <Container className="py-5">
          <Alert variant="danger">
            {error}
            <div className="mt-3">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                로그인 페이지로 이동
              </button>
            </div>
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="mypage">
      <Header />
      
      <div className="page-content py-5">
        <Container>
          <h1 className="page-title mb-4 mt-5">마이페이지</h1>
          
          <div className="user-greeting mb-4">
            <h3>안녕하세요, {userInfo?.name || email || '회원'}님!</h3>
            <p className="text-muted">
              {subscriptionInfo ? (
                <span>
                  현재 <span className="fw-bold text-primary">{formatPlanName(subscriptionInfo.plan)}</span> 플랜을 이용 중입니다.
                </span>
              ) : (
                <span>현재 일반 회원으로 이용 중입니다.</span>
              )}
            </p>
          </div>
          
          <Row>
            <Col lg={3} md={4} className="mb-4">
              <Sidebar
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                handleLogout={handleLogout}
              />
            </Col>
            
            <Col lg={9} md={8}>
              <div className="mypage-content">
                {renderActiveTab()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPage;