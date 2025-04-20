import React from 'react';
import { Card, Button } from 'react-bootstrap';

const NotificationsTab = () => {
  return (
    <div className="notifications-section">
      <Card>
        <Card.Header>
          <h4 className="mb-0">알림 설정</h4>
        </Card.Header>
        <Card.Body>
          <div className="notification-settings">
            <div className="notification-item d-flex justify-content-between align-items-center mb-3">
              <div className="notification-info">
                <h5 className="mb-1">당첨 결과 알림</h5>
                <p className="text-muted mb-0">추첨 후 당첨 결과를 알려드립니다.</p>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="notifyDrawResults"
                  defaultChecked={true}
                />
              </div>
            </div>
            
            <div className="notification-item d-flex justify-content-between align-items-center mb-3">
              <div className="notification-info">
                <h5 className="mb-1">결제 알림</h5>
                <p className="text-muted mb-0">결제 예정 및 결제 완료 알림을 받습니다.</p>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="notifyPayments"
                  defaultChecked={true}
                />
              </div>
            </div>
            
            <div className="notification-item d-flex justify-content-between align-items-center mb-3">
              <div className="notification-info">
                <h5 className="mb-1">구독 관련 알림</h5>
                <p className="text-muted mb-0">구독 상태 변경 및 갱신 알림을 받습니다.</p>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="notifySubscription"
                  defaultChecked={true}
                />
              </div>
            </div>
            
            <div className="notification-item d-flex justify-content-between align-items-center">
              <div className="notification-info">
                <h5 className="mb-1">마케팅 알림</h5>
                <p className="text-muted mb-0">프로모션 및 이벤트 정보를 받습니다.</p>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="notifyMarketing"
                  defaultChecked={false}
                />
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <Button variant="primary" size="sm">
              저장
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotificationsTab;