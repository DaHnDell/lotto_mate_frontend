import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProfileTab = ({ userInfo, formatDate }) => {
  const navigate = useNavigate();
  
  // 프로필 수정 페이지로 이동
  const handleEditProfile = () => {
    navigate('/profile/edit');
  };
  return (
    <div className="profile-section">
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">프로필 정보</h4>
        </Card.Header>
        <Card.Body>
          <div className="profile-info">
            <Row className="mb-3">
              <Col md={3} className="profile-label">이메일</Col>
              <Col md={9} className="profile-value">{userInfo?.email || '-'}</Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={3} className="profile-label">이름</Col>
              <Col md={9} className="profile-value">{userInfo?.name || '-'}</Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={3} className="profile-label">연락처</Col>
              <Col md={9} className="profile-value">{userInfo?.phone || '-'}</Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={3} className="profile-label">가입일</Col>
              <Col md={9} className="profile-value">{formatDate(userInfo?.createdAt)}</Col>
            </Row>
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <Button variant="outline-primary" size="sm" onClick={handleEditProfile}>
              프로필 수정
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h4 className="mb-0">소셜 계정 연동</h4>
        </Card.Header>
        <Card.Body>
          <div className="social-accounts">
            <div className="social-account-item d-flex justify-content-between align-items-center mb-3">
              <div className="social-account-info">
                <h5 className="mb-1">카카오 계정</h5>
                <p className="text-muted mb-0">{userInfo?.socialAccounts?.kakao ? '연동 완료' : '연동되지 않음'}</p>
              </div>
              <Button 
                variant={userInfo?.socialAccounts?.kakao ? "outline-danger" : "outline-primary"} 
                size="sm"
              >
                {userInfo?.socialAccounts?.kakao ? '연동 해제' : '연동하기'}
              </Button>
            </div>
            
            <div className="social-account-item d-flex justify-content-between align-items-center">
              <div className="social-account-info">
                <h5 className="mb-1">구글 계정</h5>
                <p className="text-muted mb-0">{userInfo?.socialAccounts?.google ? '연동 완료' : '연동되지 않음'}</p>
              </div>
              <Button 
                variant={userInfo?.socialAccounts?.google ? "outline-danger" : "outline-primary"} 
                size="sm"
              >
                {userInfo?.socialAccounts?.google ? '연동 해제' : '연동하기'}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileTab;