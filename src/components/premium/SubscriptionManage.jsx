import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CreditCard, FileText, XCircleFill, ClockHistory } from 'react-bootstrap-icons';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PaymentService from '../../services/PaymentService';
import { useAuth } from '../../hooks/AuthContext';
import '/css/style.css'

const SubscriptionManage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [processingCancel, setProcessingCancel] = useState(false);
  
  const { user } = useAuth();
  const paymentService = PaymentService();
  
  // 구독 정보 조회
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await paymentService.getSubscriptionInfo();
        setSubscription(data);
      } catch (error) {
        console.error('구독 정보 조회 실패:', error);
        setError('구독 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionInfo();
  }, [user, paymentService]);
  
  // 취소 모달 열기/닫기
  const handleCancelModalOpen = () => setShowCancelModal(true);
  const handleCancelModalClose = () => setShowCancelModal(false);
  
  // 구독 취소 처리
  const handleCancelSubscription = async () => {
    if (!subscription || !cancelReason.trim()) return;
    
    try {
      setProcessingCancel(true);
      await paymentService.cancelSubscription(subscription.id, cancelReason);
      
      // 구독 정보 다시 조회 (취소 상태 반영)
      const updatedData = await paymentService.getSubscriptionInfo();
      setSubscription(updatedData);
      
      handleCancelModalClose();
      alert('구독이 성공적으로 취소되었습니다.');
    } catch (error) {
      console.error('구독 취소 실패:', error);
      alert('구독 취소 중 오류가 발생했습니다. 고객센터에 문의해주세요.');
    } finally {
      setProcessingCancel(false);
    }
  };
  
  // 결제 영수증 조회
  const handleViewReceipt = async (imp_uid) => {
    try {
      const receiptData = await paymentService.getPaymentReceipt(imp_uid);
      
      // 영수증 페이지 열기 (포트원 제공 영수증 URL)
      if (receiptData && receiptData.receipt_url) {
        window.open(receiptData.receipt_url, '_blank');
      } else {
        alert('영수증 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('영수증 조회 실패:', error);
      alert('영수증 정보를 불러오는데 실패했습니다.');
    }
  };
  
  // 플랜 이름 포맷팅
  const formatPlanName = (plan) => {
    const planMap = {
      'basic': 'BASIC',
      'standard': 'STANDARD',
      'premium': 'PREMIUM'
    };
    return planMap[plan] || plan.toUpperCase();
  };
  
  // 구독 상태 포맷팅
  const formatSubscriptionStatus = (status) => {
    const statusMap = {
      'ACTIVE': '활성',
      'INACTIVE': '비활성',
      'PENDING': '대기',
      'CANCELLED': '취소됨'
    };
    return statusMap[status] || status;
  };
  
  // 구독 상태에 따른 배지 색상
  const getStatusBadgeClass = (status) => {
    const statusClassMap = {
      'ACTIVE': 'success',
      'INACTIVE': 'secondary',
      'PENDING': 'warning',
      'CANCELLED': 'danger'
    };
    return `bg-${statusClassMap[status] || 'secondary'}`;
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };
  
  return (
    <div className="subscription-manage-page">
      <Header />
      
      <div className="page-content py-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="page-title">구독 관리</h2>
              <p className="page-subtitle">로또메이트+ 구독 정보를 확인하고 관리하세요</p>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">구독 정보를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <XCircleFill size={48} className="text-danger mb-3" />
              <p>{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                다시 시도
              </Button>
            </div>
          ) : !subscription ? (
            <div className="text-center py-5">
              <Card className="shadow-sm">
                <Card.Body className="p-5">
                  <h3 className="mb-4">현재 활성화된 구독이 없습니다</h3>
                  <p className="mb-4">로또메이트+의 다양한 프리미엄 기능을 이용해보세요.</p>
                  <Button as={Link} to="/premium" variant="primary" size="lg">
                    구독 시작하기
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <>
              {/* 구독 정보 카드 */}
              <Card className="subscription-info-card mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="m-0">{formatPlanName(subscription.plan)} 플랜</h3>
                    <span className={`badge ${getStatusBadgeClass(subscription.status)}`}>
                      {formatSubscriptionStatus(subscription.status)}
                    </span>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6}>
                      <h4 className="mb-3">구독 정보</h4>
                      <table className="table subscription-details-table">
                        <tbody>
                          <tr>
                            <th>구독 플랜</th>
                            <td>{formatPlanName(subscription.plan)}</td>
                          </tr>
                          <tr>
                            <th>결제 주기</th>
                            <td>{subscription.period === 'monthly' ? '월간' : '연간'}</td>
                          </tr>
                          <tr>
                            <th>구독 시작일</th>
                            <td>{formatDate(subscription.start_date)}</td>
                          </tr>
                          <tr>
                            <th>다음 결제일</th>
                            <td>{subscription.status === 'CANCELLED' ? '-' : formatDate(subscription.next_payment_date)}</td>
                          </tr>
                          <tr>
                            <th>자동 갱신</th>
                            <td>{subscription.auto_renewal ? '활성화' : '비활성화'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col md={6}>
                      <h4 className="mb-3">결제 정보</h4>
                      <div className="payment-method-info mb-3">
                        <div className="d-flex align-items-center">
                          <CreditCard size={24} className="me-2 text-primary" />
                          <div>
                            <p className="mb-0 fw-bold">{subscription.payment_method === 'CARD' ? '신용/체크카드' : subscription.payment_method}</p>
                            <p className="mb-0 text-muted small">
                              {subscription.card_info ? `${subscription.card_info.issuer} (${subscription.card_info.number.slice(-4)})` : '결제 정보 없음'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="recent-payment-info">
                        <h5 className="mb-2">최근 결제 내역</h5>
                        {subscription.recent_payment ? (
                          <div className="recent-payment-details">
                            <p className="mb-1">
                              <span className="fw-bold">결제일:</span> {formatDate(subscription.recent_payment.payment_date)}
                            </p>
                            <p className="mb-1">
                              <span className="fw-bold">금액:</span> ₩{subscription.recent_payment.amount.toLocaleString()}
                            </p>
                            <Button 
                              variant="link" 
                              className="p-0" 
                              onClick={() => handleViewReceipt(subscription.recent_payment.imp_uid)}
                            >
                              <FileText className="me-1" /> 영수증 보기
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted">최근 결제 내역이 없습니다.</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-white p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="subscription-price">
                      <span className="text-muted me-2">구독 금액:</span>
                      <span className="fw-bold">
                        ₩{subscription.price.toLocaleString()}
                        <span className="text-muted ms-1">/ {subscription.period === 'monthly' ? '월' : '년'}</span>
                      </span>
                    </div>
                    <div className="subscription-actions">
                      {subscription.status === 'ACTIVE' && (
                        <Button variant="outline-danger" onClick={handleCancelModalOpen}>
                          구독 취소
                        </Button>
                      )}
                      {subscription.status === 'CANCELLED' && (
                        <div className="d-flex align-items-center text-danger">
                          <ClockHistory className="me-2" />
                          <span>
                            {formatDate(subscription.end_date)}에 서비스 이용이 종료됩니다
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Footer>
              </Card>
              
              {/* 플랜 변경 섹션 */}
              {subscription.status === 'ACTIVE' && (
                <Card className="plan-change-card shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="mb-3">플랜 변경</h4>
                    <p>현재 플랜: <strong>{formatPlanName(subscription.plan)}</strong></p>
                    <p>다른 플랜으로 변경하려면 아래 버튼을 클릭하세요. 다음 결제일에 반영됩니다.</p>
                    <div className="d-flex justify-content-end">
                      <Button as={Link} to="/premium" variant="outline-primary">
                        플랜 변경하기
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              
              {/* 구독 취소 모달 */}
              <Modal show={showCancelModal} onHide={handleCancelModalClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>구독 취소</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>구독을 취소하시면 다음 결제부터 요금이 청구되지 않습니다. 현재 구독 기간이 끝날 때까지는 서비스를 계속 이용하실 수 있습니다.</p>
                  <p>구독 종료일: <strong>{formatDate(subscription.end_date)}</strong></p>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>취소 이유 (선택사항)</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="서비스 개선을 위해 취소 이유를 알려주세요."
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCancelModalClose}>
                    돌아가기
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={handleCancelSubscription}
                    disabled={processingCancel}
                  >
                    {processingCancel ? '처리 중...' : '구독 취소하기'}
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubscriptionManage;