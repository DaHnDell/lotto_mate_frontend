import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SubscriptionTab = ({ subscriptionInfo, paymentMethods, formatDate, getStatusBadgeClass, formatPlanName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="subscription-section">
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">구독 정보</h4>
        </Card.Header>
        <Card.Body>
          {subscriptionInfo ? (
            <div className="subscription-info">
              <div className="subscription-plan mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="subscription-plan-name">{formatPlanName(subscriptionInfo.plan)}</h3>
                  <span className={`badge ${getStatusBadgeClass(subscriptionInfo.status)}`}>
                    {subscriptionInfo.status === 'ACTIVE' ? '이용중' : 
                      subscriptionInfo.status === 'CANCELLED' ? '해지됨' : 
                      subscriptionInfo.status === 'PENDING' ? '대기중' : '비활성'}
                  </span>
                </div>
                <p className="subscription-price text-primary fw-bold">
                  ₩{subscriptionInfo.price?.toLocaleString() || '0'} / {subscriptionInfo.period === 'monthly' ? '월' : '년'}
                </p>
              </div>
              
              <div className="subscription-details">
                <Row className="mb-3">
                  <Col md={4} className="subscription-label">구독 시작일</Col>
                  <Col md={8} className="subscription-value">{formatDate(subscriptionInfo.startDate)}</Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="subscription-label">다음 결제일</Col>
                  <Col md={8} className="subscription-value">{formatDate(subscriptionInfo.nextPaymentDate)}</Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="subscription-label">자동 갱신</Col>
                  <Col md={8} className="subscription-value">
                    {subscriptionInfo.autoRenewal ? '활성화' : '비활성화'}
                  </Col>
                </Row>
                
                {subscriptionInfo.status === 'CANCELLED' && (
                  <Row className="mb-3">
                    <Col md={4} className="subscription-label">서비스 종료일</Col>
                    <Col md={8} className="subscription-value">{formatDate(subscriptionInfo.endDate)}</Col>
                  </Row>
                )}
                
                <Row className="mb-3">
                  <Col md={4} className="subscription-label">결제 수단</Col>
                  <Col md={8} className="subscription-value">
                    {subscriptionInfo.paymentMethod?.cardName ? 
                      `${subscriptionInfo.paymentMethod.cardName} (${subscriptionInfo.paymentMethod.cardNumber})` : 
                      '등록된 결제 수단 없음'}
                  </Col>
                </Row>
              </div>
              
              <div className="subscription-actions d-flex justify-content-end mt-4">
                {subscriptionInfo.status === 'ACTIVE' ? (
                  <>
                    <Button 
                      variant="outline-primary" 
                      className="me-2"
                      onClick={() => navigate('/premium')}
                    >
                      플랜 변경
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => navigate('/mypage/subscription')}
                    >
                      구독 관리
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/premium')}
                  >
                    구독 시작하기
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="no-subscription text-center py-4">
              <h5 className="mb-3">현재 구독 중인 서비스가 없습니다</h5>
              <p className="mb-4">로또메이트+의 다양한 프리미엄 기능을 이용해보세요.</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/premium')}
              >
                구독 시작하기
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h4 className="mb-0">결제 수단 관리</h4>
        </Card.Header>
        <Card.Body>
          {paymentMethods.length > 0 ? (
            <div className="payment-methods">
              {paymentMethods.map((method, index) => (
                <div key={index} className="payment-method-item d-flex justify-content-between align-items-center mb-3">
                  <div className="payment-method-info">
                    <h5 className="mb-1">{method.cardName}</h5>
                    <p className="text-muted mb-0">
                      {method.cardNumber}
                      {method.isDefault && <span className="badge bg-primary ms-2">기본</span>}
                    </p>
                  </div>
                  <div className="payment-method-actions">
                    {!method.isDefault && (
                      <Button variant="outline-primary" size="sm" className="me-2">
                        기본으로 설정
                      </Button>
                    )}
                    <Button variant="outline-danger" size="sm">
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="d-flex justify-content-end mt-4">
                <Button variant="primary" size="sm">
                  새 결제 수단 추가
                </Button>
              </div>
            </div>
          ) : (
            <div className="no-payment-methods text-center py-4">
              <h5 className="mb-3">등록된 결제 수단이 없습니다</h5>
              <p className="mb-4">구독 서비스를 이용하기 위해 결제 수단을 등록해주세요.</p>
              <Button variant="primary" size="sm">
                결제 수단 추가
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SubscriptionTab;