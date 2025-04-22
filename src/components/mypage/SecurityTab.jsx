import React from 'react';
import { Card, Button } from 'react-bootstrap';

const SecurityTab = ({ userInfo }) => {
  return (
    <div className="security-section">
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">보안 설정</h4>
        </Card.Header>
        <Card.Body>
          <div className="security-items">
            <div className="security-item d-flex justify-content-between align-items-center mb-4">
              <div className="security-info">
                <h5 className="mb-1">비밀번호 변경</h5>
                <p className="text-muted mb-0">주기적인 비밀번호 변경으로 계정을 안전하게 보호하세요.</p>
              </div>
              <Button variant="outline-primary" size="sm">
                변경하기
              </Button>
            </div>
            
            <div className="security-item d-flex justify-content-between align-items-center mb-4">
              <div className="security-info">
                <h5 className="mb-1">이메일 인증</h5>
                <p className="text-muted mb-0">이메일 인증 상태: {userInfo?.emailVerified ? '인증됨' : '미인증'}</p>
              </div>
              {!userInfo?.emailVerified && (
                <Button variant="outline-primary" size="sm">
                  인증하기
                </Button>
              )}
            </div>
            
            <div className="security-item d-flex justify-content-between align-items-center">
              <div className="security-info">
                <h5 className="mb-1">로그인 기록</h5>
                <p className="text-muted mb-0">계정의 최근 로그인 활동을 확인할 수 있습니다.</p>
              </div>
              <Button variant="outline-primary" size="sm">
                확인하기
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h4 className="mb-0">계정 관리</h4>
        </Card.Header>
        <Card.Body>
          <div className="account-management">
            <div className="account-item d-flex justify-content-between align-items-center mb-3">
              <div className="account-info">
                <h5 className="mb-1">계정 비활성화</h5>
                <p className="text-muted mb-0">일시적으로 계정을 비활성화합니다. 언제든지 다시 활성화할 수 있습니다.</p>
              </div>
              <Button variant="outline-warning" size="sm">
                비활성화
              </Button>
            </div>
            
            <div className="account-item d-flex justify-content-between align-items-center">
              <div className="account-info">
                <h5 className="mb-1">계정 삭제</h5>
                <p className="text-muted mb-0">계정을 완전히 삭제합니다. 이 작업은 되돌릴 수 없습니다.</p>
              </div>
              <Button variant="outline-danger" size="sm">
                삭제하기
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SecurityTab;