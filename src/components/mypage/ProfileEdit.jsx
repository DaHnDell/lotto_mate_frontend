import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
// import { useAuth } from '../../hooks/AuthContext';
import '/css/style.css'

const ProfileEdit = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // 폼 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // const { email } = useAuth();
  const navigate = useNavigate();
  
  // 사용자 정보 로드
  useEffect(() => {
    // 임시 데이터
    const tempUserInfo = {
      id: 1,
      email: 'user@example.com',
      name: '홍길동',
      phone: '010-1234-5678',
      createdAt: '2024-10-15T09:30:00',
      emailVerified: true,
      profileImage: null,
      socialAccounts: {
        kakao: true,
        google: false
      }
    };
    
    // 임시 데이터로 상태 설정 (실제 구현 시에는 API 호출)
    setTimeout(() => {
      setUserInfo(tempUserInfo);
      setName(tempUserInfo.name);
      setPhone(tempUserInfo.phone);
      setLoading(false);
    }, 700);
    
    /* 
    // 실제 API 구현 시 사용할 코드
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await req('GET', 'user/info');
        setUserInfo(response);
        setName(response.name);
        setPhone(response.phone);
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
    */
  }, []);
  
  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 검증
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    
    // 전화번호 형식 검증 (선택 사항)
    if (phone && !/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/.test(phone)) {
      setError('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 폼 데이터 생성 (이미지 업로드를 위한 FormData 사용)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      /* 
      // 실제 API 호출 코드
      await req('PUT', 'user/profile', formData, {}, true);
      */
      
      // 임시 - 실제 API 호출 대신 타임아웃으로 대체
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess(true);
      
      // 3초 후 마이페이지로 이동
      setTimeout(() => {
        navigate('/mypage');
      }, 2000);
    } catch (err) {
      console.error('프로필 저장 실패:', err);
      setError('프로필 정보를 저장하는데 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };
  
  // 이미지 선택 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 취소 버튼 클릭 처리
  const handleCancel = () => {
    navigate('/mypage');
  };
  
  if (loading) {
    return (
      <div className="profile-edit">
        <Header />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">사용자 정보를 불러오고 있습니다...</p>
        </Container>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="profile-edit">
      <Header />
      
      <div className="page-content py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <h1 className="page-title mb-4 mt-5">프로필 수정</h1>
              
              <Card>
                <Card.Body className="p-4 mx-5">
                  {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert variant="success">
                      프로필이 성공적으로 저장되었습니다. 마이페이지로 이동합니다.
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-4">
                      <Col md={4} className="text-center">
                        <div className="profile-image-container mb-3">
                          <div className="profile-image">
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="프로필 미리보기" 
                                className="img-fluid rounded-circle"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                              />
                            ) : userInfo.profileImage ? (
                              <img 
                                src={userInfo.profileImage} 
                                alt="프로필 이미지" 
                                className="img-fluid rounded-circle"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div 
                                className="default-profile-image rounded-circle bg-light d-flex align-items-center justify-content-center"
                                style={{ width: '150px', height: '150px', fontSize: '3rem', color: '#6c757d' }}
                              >
                                {userInfo.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <Form.Group controlId="profileImage" className="mb-3">
                              <Form.Label className="btn btn-outline-primary btn-sm">
                                이미지 변경
                                <Form.Control 
                                  type="file" 
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={handleImageChange}
                                />
                              </Form.Label>
                            </Form.Group>
                          </div>
                        </div>
                      </Col>
                      
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>이메일</Form.Label>
                          <Form.Control 
                            type="email" 
                            value={userInfo.email}
                            disabled
                          />
                          <Form.Text className="text-muted">
                            이메일은 변경할 수 없습니다.
                          </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>이름</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름을 입력하세요"
                            required
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>연락처</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="연락처를 입력하세요 (예: 010-1234-5678)"
                          />
                          <Form.Text className="text-muted">
                            입력하신 연락처는 중요 알림 전달에만 사용됩니다.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="outline-secondary" 
                        className="me-2"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        취소
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={saving || success}
                      >
                        {saving ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            저장 중...
                          </>
                        ) : "저장"}
                      </Button>
                    </div>
                  </Form>
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

export default ProfileEdit;