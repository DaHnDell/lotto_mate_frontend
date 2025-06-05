import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleFill } from 'react-bootstrap-icons';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { usePaymentService } from '../../services/PaymentService'; 
import '../../resources/css/style.css';

const SubscriptionComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { paymentService, isReady } = usePaymentService();
  
  // fetchSubscriptionDetails 함수를 useCallback으로 메모이제이션
  const fetchSubscriptionDetails = useCallback(async (impUid) => {
    if (!isReady) {
      console.warn('PaymentService가 아직 준비되지 않았습니다.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getSubscriptionDetails(impUid);
      setSubscriptionData(data);
    } catch (err) {
      console.error('구독 정보 조회 실패:', err);
      setError('구독 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [paymentService, isReady]);
  
  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    // PaymentService가 준비되지 않았으면 대기
    if (!isReady) {
      return;
    }
    
    // location.state에서 impUid 추출
    const impUid = location.state?.impUid;
    
    if (impUid) {
      // impUid가 있으면 구독 정보 조회
      fetchSubscriptionDetails(impUid);
    } else {
      // impUid가 없으면 홈으로 리다이렉트
      console.warn('결제 정보가 없습니다. 홈으로 이동합니다.');
      navigate('/', { replace: true });
    }
  }, [isReady, fetchSubscriptionDetails, location.state, navigate]);
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };
  
  // 구독 플랜 이름 포맷팅
  const formatPlanName = (plan) => {
    const planMap = {
      'basic': 'BASIC',
      'standard': 'STANDARD',
      'premium': 'PREMIUM'
    };
    return planMap[plan] || plan.toUpperCase();
  };
  
  // 플랜별 혜택 정보
  const getPlanBenefits = (plan) => {
    const benefits = {
      'basic': [
        '주 1회 자동 번호 구매',
        '번호 분석 리포트',
        '당첨 문자 알림',
        '번호 저장 50개'
      ],
      'standard': [
        '주 2회 자동 번호 구매',
        '번호 분석 리포트',
        '당첨 문자 알림',
        '번호 저장 200개',
        '무제한 번호 추천'
      ],
      'premium': [
        '주 3회 자동 번호 구매',
        '번호 분석 리포트',
        '당첨 문자 알림',
        '번호 저장 무제한',
        '무제한 번호 추천',
        '1:1 당첨 컨설팅',
        '우선 고객 지원'
      ]
    };
    
    return benefits[plan] || [];
  };
  
  // PaymentService가 준비되지 않은 상태
  if (!isReady) {
    return (
      <div className="subscription-complete-page">
        <Header />
        <div className="page-content py-5">
          <Container>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">서비스 초기화 중...</span>
              </div>
              <p className="mt-3">결제 서비스를 준비하고 있습니다...</p>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
  
  // 로딩 상태
  if (loading) {
    return (
      <div className="subscription-complete-page">
        <Header />
        <div className="page-content py-5">
          <Container>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
              <p className="mt-3">구독 정보를 확인하고 있습니다...</p>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
  
  // 에러 상태
  if (error) {
    return (
      <div className="subscription-complete-page">
        <Header />
        <div className="page-content py-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card className="text-center p-4">
                  <Card.Body>
                    <h2 className="text-danger mb-3">오류 발생</h2>
                    <p className="mb-4">{error}</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Button as={Link} to="/" variant="primary">
                        홈으로 가기
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => window.location.reload()}
                      >
                        다시 시도
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
  
  // 구독 데이터가 없는 경우
  if (!subscriptionData) {
    return (
      <div className="subscription-complete-page">
        <Header />
        <div className="page-content py-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card className="text-center p-4">
                  <Card.Body>
                    <h2 className="mb-3">구독 정보를 찾을 수 없습니다</h2>
                    <p className="mb-4">구독 정보를 확인할 수 없습니다. 마이페이지에서 구독 상태를 확인해주세요.</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Button as={Link} to="/" variant="primary">
                        홈으로 가기
                      </Button>
                      <Button as={Link} to="/mypage/subscription" variant="outline-primary">
                        구독 관리
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="subscription-complete-page">
      <Header />
      
      <div className="page-content py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="subscription-complete-card shadow-sm">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div className="success-icon-circle">
                      <CheckCircleFill size={48} className="text-success" />
                    </div>
                    <h2 className="mt-4 mb-3">구독이 완료되었습니다!</h2>
                    <p className="text-muted">
                      로또메이트+ 서비스를 이용해 주셔서 감사합니다.
                    </p>
                  </div>
                  
                  <div className="subscription-details mt-4">
                    <h4 className="mb-4">구독 정보</h4>
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>구독 플랜</th>
                          <td>{formatPlanName(subscriptionData.plan)}</td>
                        </tr>
                        <tr>
                          <th>구독 기간</th>
                          <td>{subscriptionData.period === 'monthly' ? '월간' : '연간'}</td>
                        </tr>
                        <tr>
                          <th>구독 금액</th>
                          <td>₩{subscriptionData.amount.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <th>구독 시작일</th>
                          <td>{formatDate(subscriptionData.startDate)}</td>
                        </tr>
                        <tr>
                          <th>다음 결제일</th>
                          <td>{formatDate(subscriptionData.nextPaymentDate)}</td>
                        </tr>
                        <tr>
                          <th>주문번호</th>
                          <td>{subscriptionData.merchantUid}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="subscription-benefits mt-4 mb-4">
                    <h4 className="mb-3">이용 가능한 혜택</h4>
                    <ul className="benefit-list">
                      {getPlanBenefits(subscriptionData.plan).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="subscription-actions mt-4 text-center">
                    <p className="mb-4">이제 로또메이트+의 모든 기능을 이용하실 수 있습니다.</p>
                    <div className="d-flex justify-content-between">
                      <Button as={Link} to="/mypage/subscription" variant="outline-primary">
                        구독 관리
                      </Button>
                      <Button as={Link} to="/number-generator" variant="primary">
                        번호 생성하기
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubscriptionComplete;