import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HistoryTab = ({ subscriptionInfo, userNumbers, formatDate, formatPlanName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="history-section">
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">구독 이력</h4>
        </Card.Header>
        <Card.Body>
          {subscriptionInfo ? (
            <div className="subscription-history">
              <div className="subscription-history-item mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{formatPlanName(subscriptionInfo.plan)} 플랜 구독</h5>
                    <p className="text-muted mb-0">
                      시작일: {formatDate(subscriptionInfo.startDate)} | 
                      상태: <span className={`text-${subscriptionInfo.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                        {subscriptionInfo.status === 'ACTIVE' ? '이용중' : '해지됨'}
                      </span>
                    </p>
                  </div>
                  <div className="subscription-history-price">
                    ₩{subscriptionInfo.price?.toLocaleString() || '0'} / {subscriptionInfo.period === 'monthly' ? '월' : '년'}
                  </div>
                </div>
              </div>
              
              {/* 이전 구독 기록이 있다면 표시 (예시) */}
              <div className="subscription-history-item mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">BASIC 플랜 구독</h5>
                    <p className="text-muted mb-0">
                      기간: 2024-12-01 ~ 2025-01-01 | 
                      상태: <span className="text-danger">해지됨</span>
                    </p>
                  </div>
                  <div className="subscription-history-price">
                    ₩5,000 / 월
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-history text-center py-3">
              <p className="mb-0">구독 이력이 없습니다.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">결제 내역</h4>
        </Card.Header>
        <Card.Body>
          {subscriptionInfo?.recentPayment ? (
            <div className="payment-history">
              <div className="payment-history-item mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{formatPlanName(subscriptionInfo.plan)} 플랜 결제</h5>
                    <p className="text-muted mb-0">
                      결제일: {formatDate(subscriptionInfo.recentPayment.paymentDate)} | 
                      상태: <span className="text-success">완료</span>
                    </p>
                  </div>
                  <div className="payment-history-actions">
                    <span className="payment-amount me-3">₩{subscriptionInfo.price?.toLocaleString() || '0'}</span>
                    {subscriptionInfo.recentPayment.receiptUrl && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => window.open(subscriptionInfo.recentPayment.receiptUrl, '_blank')}
                      >
                        영수증
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 이전 결제 기록 예시 */}
              <div className="payment-history-item mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">BASIC 플랜 결제</h5>
                    <p className="text-muted mb-0">
                      결제일: 2024-12-01 | 
                      상태: <span className="text-success">완료</span>
                    </p>
                  </div>
                  <div className="payment-history-actions">
                    <span className="payment-amount me-3">₩5,000</span>
                    <Button variant="outline-primary" size="sm">
                      영수증
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-history text-center py-3">
              <p className="mb-0">결제 내역이 없습니다.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h4 className="mb-0">당첨 내역</h4>
        </Card.Header>
        <Card.Body>
          {userNumbers.length > 0 ? (
            <div className="winning-history">
              {/* 당첨 내역 예시 */}
              <div className="winning-history-item mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">1059회 당첨</h5>
                    <p className="text-muted mb-0">
                      당첨일: 2025-03-05 | 
                      등수: <span className="text-success fw-bold">5등</span>
                    </p>
                  </div>
                  <div className="winning-amount">
                    ₩5,000
                  </div>
                </div>
                <div className="mt-2">
                  <div className="lotto-number-container">
                    <span className="lotto-ball lotto-ball-1">2</span>
                    <span className="lotto-ball lotto-ball-2">15</span>
                    <span className="lotto-ball lotto-ball-3">25</span>
                    <span className="lotto-ball lotto-ball-4">32</span>
                    <span className="lotto-ball lotto-ball-4">38</span>
                    <span className="lotto-ball lotto-ball-5">44</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-history text-center py-3">
              <p className="mb-0">당첨 내역이 없습니다.</p>
            </div>
          )}
          
          <div className="d-flex justify-content-end mt-3">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate('/winning-history')}
            >
              전체 당첨 내역 보기
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HistoryTab;