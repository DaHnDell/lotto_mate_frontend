/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Badge, 
  Tabs,
  Tab,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  PencilFill, 
  TrashFill, 
  ToggleOn, 
  ToggleOff, 
  PlusCircleFill, 
  CheckCircleFill, 
  XCircleFill,
  ArrowRepeat,
  ExclamationTriangleFill,
  InfoCircleFill
} from 'react-bootstrap-icons';
import UseAxios from '../../hooks/UseAxios';
import '../../resources/css/admin-style.css';

const SubscriptionManagement = () => {
  // API 요청을 위한 UseAxios 훅 초기화
  const plansApi = UseAxios();
  const subscriptionsApi = UseAxios();
  const cancellationsApi = UseAxios();

  // 상태 관리
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('plans');

  // 초기 로딩 상태 관리 
  const [initialLoading, setInitialLoading] = useState(true);
  
  // 모달 상태 관리
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // 오류 상태 관리 
  const [error, setError] = useState(null);
  
  // 새 플랜 폼 상태 관리
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    durationMonths: 1,
    maxLottoNumbers: 50,
    features: '',
    active: true
  });

  // 데이터 로딩
  const fetchPlans = useCallback(async () => {
    try {
      const plansData = await plansApi.req('GET', 'admin/subscription/plans/all');
      setPlans(plansData || []);
    } catch (err) {
      console.error('구독 플랜 로딩 오류:', err);
      // 오류 발생 시 빈 배열로 설정
      setPlans([]);
    }
  }, [plansApi]);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const subsData = await subscriptionsApi.req('GET', 'admin/subscription/list');
      setSubscriptions(subsData || []);
    } catch (err) {
      console.error('구독 정보 로딩 오류:', err);
      setSubscriptions([]);
    }
  }, [subscriptionsApi]);

  const fetchCancellations = useCallback(async () => {
    try {
      const cancelData = await cancellationsApi.req('GET', 'admin/subscription/cancellations');
      setCancelRequests(cancelData || []);
    } catch (err) {
      console.error('취소 요청 로딩 오류:', err);
      setCancelRequests([]);
    }
  }, [cancellationsApi]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchPlans(),
          fetchSubscriptions(),
          fetchCancellations()
        ]);
        setError(null);
      } catch (err) {
        console.error('초기 데이터 로딩 오류:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // 플랜 추가 처리
  const handleAddPlan = async () => {
    try {
      const response = await plansApi.req('POST', 'admin/subscription/plans', newPlan);
      
      if (response) {
        // 데이터 다시 불러오기
        const plansData = await plansApi.req('GET', 'admin/subscription/plans/all');
        setPlans(plansData || []);
        setShowAddModal(false);
        
        // 폼 초기화
        setNewPlan({
          name: '',
          description: '',
          price: '',
          durationMonths: 1,
          maxLottoNumbers: 50,
          features: '',
          active: true
        });
      }
    } catch (err) {
      console.error('플랜 추가 오류:', err);
      alert('플랜 추가 중 오류가 발생했습니다.');
    }
  };
  
  // 플랜 수정 처리
  const handleEditPlan = async () => {
    try {
      const response = await plansApi.req('PUT', `admin/subscription/plans/${currentPlan.id}`, currentPlan);
      
      if (response) {
        // 데이터 다시 불러오기
        const plansData = await plansApi.req('GET', 'admin/subscription/plans/all');
        setPlans(plansData || []);
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('플랜 수정 오류:', err);
      alert('플랜 수정 중 오류가 발생했습니다.');
    }
  };
  
  // 플랜 삭제 처리 (비활성화)
  const handleDeletePlan = async () => {
    try {
      const response = await plansApi.req('DELETE', `admin/subscription/plans/${currentPlan.id}`);
      
      if (response) {
        // 데이터 다시 불러오기
        const plansData = await plansApi.req('GET', 'admin/subscription/plans/all');
        setPlans(plansData || []);
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error('플랜 삭제 오류:', err);
      alert('플랜 삭제 중 오류가 발생했습니다. 현재 구독 중인 사용자가 있는지 확인해주세요.');
    }
  };
  
  // 플랜 활성화/비활성화 토글
  const togglePlanStatus = async (planId) => {
    try {
      // 현재 플랜 정보 찾기
      const planToToggle = plans.find(plan => plan.id === planId);
      if (!planToToggle) return;
      
      // 임시로 UI 먼저 업데이트 (사용자 경험 향상)
      const updatedPlans = plans.map(plan => 
        plan.id === planId ? { ...plan, active: !plan.active } : plan
      );
      setPlans(updatedPlans);
      
      // 상태 토글하여 업데이트 요청
      const updatedPlan = { ...planToToggle, active: !planToToggle.active };
      await plansApi.req('PUT', `admin/subscription/plans/toggle/${planId}`, updatedPlan);
      
      // API 응답 후 최신 데이터로 다시 업데이트
      fetchPlans();
    } catch (err) {
      console.error('플랜 상태 변경 오류:', err);
      // 오류 발생 시 원래 상태로 복원
      fetchPlans();
      alert('플랜 상태 변경 중 오류가 발생했습니다.');
    }
  };
  
  // 취소 요청 처리
  const handleCancellationRequest = async (requestId, approved) => {
    try {
      const requestBody = {
        cancellationId: requestId, 
        adminProcessed: true, 
        adminNote: approved ? '관리자 승인' : '관리자 거부',
        processRefund: approved
      };
      
      const response = await cancellationsApi.req(
        'PUT', 
        'admin/subscription/cancellations/process', 
        requestBody
      );
      
      if (response) {
        // 데이터 다시 불러오기
        const cancelData = await cancellationsApi.req('GET', 'admin/subscription/cancellations');
        setCancelRequests(cancelData || []);
      }
    } catch (err) {
      console.error('취소 요청 처리 오류:', err);
      alert('취소 요청 처리 중 오류가 발생했습니다.');
    }
  };

  // 플랜 상태 뱃지 렌더링
  const renderStatusBadge = (active) => {
    return active ? 
      <Badge bg="success">활성</Badge> : 
      <Badge bg="secondary">비활성</Badge>;
  };

  // 구독 상태 뱃지 렌더링
  const renderSubscriptionStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE':
        return <Badge bg="success">활성</Badge>;
      case 'CANCELLED':
        return <Badge bg="danger">취소됨</Badge>;
      case 'PENDING':
        return <Badge bg="warning">대기</Badge>;
      default:
        return <Badge bg="secondary">기타</Badge>;
    }
  };

  // 입력 변경 처리 함수
  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    
    // 체크박스인 경우 checked 값을, 그 외에는 value 값을 사용
    const inputValue = type === 'checkbox' ? checked : value;
    
    // 숫자 필드는 숫자로 변환
    const finalValue = ['price', 'durationMonths', 'maxLottoNumbers'].includes(name) && inputValue !== '' 
      ? Number(inputValue) 
      : inputValue;
    
    if (formType === 'new') {
      setNewPlan(prev => ({ ...prev, [name]: finalValue }));
    } else if (formType === 'edit') {
      setCurrentPlan(prev => ({ ...prev, [name]: finalValue }));
    }
  };

   // 로딩 중 표시 - 초기 로딩 상태만 체크
   if (initialLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 오류 표시
  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        <div className="d-flex align-items-center">
          <ExclamationTriangleFill className="me-2" size={20} />
          {error}
        </div>
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          <ArrowRepeat /> 새로고침
        </Button>
      </Alert>
    );
  }

  return (
    <div className="subscription-management p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">구독 관리</h2>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="plans" title="구독 플랜" className='tab-name'>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">구독 플랜 목록</h5>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowAddModal(true)}
              >
                <PlusCircleFill className="me-2" />
                새 플랜 등록
              </Button>
            </Card.Header>
            <Card.Body>
              {plans.length === 0 ? (
                <Alert variant="info">
                  <InfoCircleFill className="me-2" />
                  등록된 구독 플랜이 없습니다. 새 플랜을 등록해주세요.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>플랜명</th>
                      <th>가격</th>
                      <th>기간</th>
                      <th>저장 개수</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(plan => (
                      <tr key={plan.id}>
                        <td>{plan.id}</td>
                        <td>
                          <strong>{plan.name}</strong>
                          <br />
                          <small className="text-muted">{plan.description}</small>
                        </td>
                        <td>{plan.price.toLocaleString()}원</td>
                        <td>{plan.durationMonths}개월</td>
                        <td>{plan.maxLottoNumbers.toLocaleString()}</td>
                        <td>{renderStatusBadge(plan.active)}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => {
                              setCurrentPlan(plan);
                              setShowEditModal(true);
                            }}
                          >
                            <PencilFill />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="me-2"
                            onClick={() => {
                              setCurrentPlan(plan);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashFill />
                          </Button>
                          <Button 
                            variant={plan.active ? "outline-secondary" : "outline-success"} 
                            size="sm"
                            onClick={() => togglePlanStatus(plan.id)}
                          >
                            {plan.active ? <ToggleOff /> : <ToggleOn />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="subscriptions" title="구독 현황" className='tab-name'>
          <Card>
            <Card.Header>
              <h5 className="mb-0">구독 현황</h5>
            </Card.Header>
            <Card.Body>
              {subscriptions.length === 0 ? (
                <Alert variant="info">
                  <InfoCircleFill className="me-2" />
                  현재 구독 정보가 없습니다.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>사용자</th>
                      <th>플랜</th>
                      <th>시작일</th>
                      <th>종료일</th>
                      <th>상태</th>
                      <th>자동갱신</th>
                      <th>다음 결제일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map(subscription => (
                      <tr key={subscription.id}>
                        <td>{subscription.id}</td>
                        <td>
                          <strong>{subscription.userName}</strong>
                          <br />
                          <small>{subscription.userEmail}</small>
                        </td>
                        <td>{subscription.planName}</td>
                        <td>{subscription.startDate}</td>
                        <td>{subscription.endDate}</td>
                        <td>{renderSubscriptionStatusBadge(subscription.status)}</td>
                        <td>
                          {subscription.autoRenewal ? 
                            <Badge bg="info">활성화</Badge> : 
                            <Badge bg="secondary">비활성화</Badge>}
                        </td>
                        <td>{subscription.nextPaymentDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="cancellations" title="취소 요청" className='tab-name'>
          <Card>
            <Card.Header>
              <h5 className="mb-0">취소 요청</h5>
            </Card.Header>
            <Card.Body>
              {cancelRequests.length === 0 ? (
                <Alert variant="info">
                  <InfoCircleFill className="me-2" />
                  현재 처리할 취소 요청이 없습니다.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>사용자</th>
                      <th>플랜</th>
                      <th>취소 요청일</th>
                      <th>종료 예정일</th>
                      <th>취소 이유</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelRequests.map(request => (
                      <tr key={request.id}>
                        <td>{request.id}</td>
                        <td>
                          <strong>{request.userName}</strong>
                          <br />
                          <small>{request.userEmail}</small>
                        </td>
                        <td>{request.planName}</td>
                        <td>{request.cancellationDate}</td>
                        <td>{request.effectiveEndDate}</td>
                        <td>{request.reason}</td>
                        <td>
                          {request.adminProcessed ? (
                            <Badge bg="secondary">처리완료</Badge>
                          ) : (
                            <>
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleCancellationRequest(request.id, true)}
                              >
                                <CheckCircleFill /> 승인
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleCancellationRequest(request.id, false)}
                              >
                                <XCircleFill /> 거부
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      {/* 플랜 추가 모달 */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>새 구독 플랜 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>플랜명 <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={newPlan.name}
                onChange={(e) => handleInputChange(e, 'new')}
                required
              />
              <Form.Text className="text-muted">
                영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다. (예: basic, premium_plus)
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>설명</Form.Label>
              <Form.Control 
                type="text" 
                name="description"
                value={newPlan.description}
                onChange={(e) => handleInputChange(e, 'new')}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>가격 (원) <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="number" 
                name="price"
                value={newPlan.price}
                onChange={(e) => handleInputChange(e, 'new')}
                required
                min="0"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>구독 기간 (개월) <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="number" 
                name="durationMonths"
                value={newPlan.durationMonths}
                onChange={(e) => handleInputChange(e, 'new')}
                required
                min="1"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>최대 저장 번호 개수 <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="number" 
                name="maxLottoNumbers"
                value={newPlan.maxLottoNumbers}
                onChange={(e) => handleInputChange(e, 'new')}
                required
                min="1"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>제공 기능</Form.Label>
              <Form.Control 
                as="textarea" 
                name="features"
                value={newPlan.features}
                onChange={(e) => handleInputChange(e, 'new')}
                rows={3}
              />
              <Form.Text className="text-muted">
                콤마(,)로 구분하여 기능을 나열하세요.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="활성화" 
                name="active"
                checked={newPlan.active}
                onChange={(e) => handleInputChange(e, 'new')}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleAddPlan}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 플랜 수정 모달 */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>구독 플랜 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPlan && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>플랜명 <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  name="name"
                  value={currentPlan.name}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>플랜 ID <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="hidden" 
                  name="id"
                  value={currentPlan.id}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>설명</Form.Label>
                <Form.Control 
                  type="text" 
                  name="description"
                  value={currentPlan.description}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>가격 (원) <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="number" 
                  name="price"
                  value={currentPlan.price}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  required
                  min="0"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>구독 기간 (개월) <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="number" 
                  name="durationMonths"
                  value={currentPlan.durationMonths}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  required
                  min="1"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>최대 저장 번호 개수 <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="number" 
                  name="maxLottoNumbers"
                  value={currentPlan.maxLottoNumbers}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  required
                  min="1"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>제공 기능</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="features"
                  value={currentPlan.features}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  rows={3}
                />
                <Form.Text className="text-muted">
                  콤마(,)로 구분하여 기능을 나열하세요.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="활성화" 
                  name="active"
                  checked={currentPlan.active}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleEditPlan}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 플랜 삭제 확인 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>구독 플랜 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPlan && (
            <div>
              <p>
                <strong>{currentPlan.name}</strong> 플랜을 정말 삭제하시겠습니까?
              </p>
              <Alert variant="warning">
                <strong>주의:</strong> 현재 이 플랜을 구독 중인 사용자가 있는 경우 삭제가 불가능합니다. 대신 비활성화를 이용해주세요.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDeletePlan}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;