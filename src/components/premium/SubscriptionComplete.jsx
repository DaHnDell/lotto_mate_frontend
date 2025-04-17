import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleFill } from 'react-bootstrap-icons';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PaymentService from '../../services/PaymentService';
import '../../resources/css/style.css';

const SubscriptionComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const paymentService = PaymentService();
  
  // URL 파라미터나 location state에서 결제 정보 가져오기
  useEffect(() => {
    // 결제 정보 확인
    if (location.state && location.state.impUid) {
      // 백엔드 API 호출
      const fetchSubscriptionDetails = async () => {
        try {
          const data = await paymentService.getSubscriptionDetails(location.state.impUid);
          setSubscriptionData(data);
        } catch (error) {
          console.error('구독 정보 조회 실패:', error);
          alert('구독 정보를 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubscriptionDetails();
    } else {
      // 잘못된 접근 시 홈으로 리다이렉트
      navigate('/');
    }
  }, [location, navigate, paymentService]);
  
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
  
  return (
    <div className="subscription-complete-page">
      <Header />
      
      <div className="page-content py-5">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
              <p className="mt-3">구독 정보를 확인하고 있습니다...</p>
            </div>
          ) : (
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
                            <td>{formatDate(subscriptionData.start_date)}</td>
                          </tr>
                          <tr>
                            <th>다음 결제일</th>
                            <td>{formatDate(subscriptionData.next_payment_date)}</td>
                          </tr>
                          <tr>
                            <th>주문번호</th>
                            <td>{subscriptionData.merchant_uid}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="subscription-benefits mt-4 mb-4">
                      <h4 className="mb-3">이용 가능한 혜택</h4>
                      <ul className="benefit-list">
                        {subscriptionData.plan === 'basic' && (
                          <>
                            <li>주 1회 자동 번호 구매</li>
                            <li>번호 분석 리포트</li>
                            <li>당첨 문자 알림</li>
                            <li>번호 저장 50개</li>
                          </>
                        )}
                        {subscriptionData.plan === 'standard' && (
                          <>
                            <li>주 2회 자동 번호 구매</li>
                            <li>번호 분석 리포트</li>
                            <li>당첨 문자 알림</li>
                            <li>번호 저장 200개</li>
                            <li>무제한 번호 추천</li>
                          </>
                        )}
                        {subscriptionData.plan === 'premium' && (
                          <>
                            <li>주 3회 자동 번호 구매</li>
                            <li>번호 분석 리포트</li>
                            <li>당첨 문자 알림</li>
                            <li>번호 저장 무제한</li>
                            <li>무제한 번호 추천</li>
                            <li>1:1 당첨 컨설팅</li>
                            <li>우선 고객 지원</li>
                          </>
                        )}
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
          )}
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubscriptionComplete;