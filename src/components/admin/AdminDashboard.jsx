import React from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card 
} from 'react-bootstrap';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  People, 
  CreditCard, 
  CashCoin, 
  Trophy 
} from 'react-bootstrap-icons';

// 가상 데이터
const userStatData = [
  { month: '1월', users: 400, newUsers: 240 },
  { month: '2월', users: 450, newUsers: 139 },
  { month: '3월', users: 520, newUsers: 180 },
  { month: '4월', users: 590, newUsers: 250 },
  { month: '5월', users: 650, newUsers: 210 },
  { month: '6월', users: 700, newUsers: 220 },
  { month: '7월', users: 780, newUsers: 300 },
  { month: '8월', users: 830, newUsers: 250 },
  { month: '9월', users: 900, newUsers: 320 },
  { month: '10월', users: 950, newUsers: 280 },
  { month: '11월', users: 1000, newUsers: 300 },
  { month: '12월', users: 1100, newUsers: 350 },
];

const subscriptionData = [
  { name: 'Basic', value: 35 },
  { name: 'Standard', value: 45 },
  { name: 'Premium', value: 20 },
];

const revenueData = [
  { month: '1월', revenue: 2400000 },
  { month: '2월', revenue: 3100000 },
  { month: '3월', revenue: 2800000 },
  { month: '4월', revenue: 3200000 },
  { month: '5월', revenue: 3800000 },
  { month: '6월', revenue: 3500000 },
  { month: '7월', revenue: 4000000 },
  { month: '8월', revenue: 4200000 },
  { month: '9월', revenue: 4500000 },
  { month: '10월', revenue: 4800000 },
  { month: '11월', revenue: 5000000 },
  { month: '12월', revenue: 5500000 },
];

// 색상
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard = () => {
  // 금액 포맷 함수
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(value);
  };

  // 숫자 포맷 함수
  const formatNumber = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">대시보드</h1>
        <p className="dashboard-subtitle">로또메이트 관리자 대시보드에 오신 것을 환영합니다</p>
      </div>

      <Container fluid>
        {/* 요약 카드 */}
        <Row className="summary-cards">
          <Col lg={3} md={6} sm={6} className="mb-4">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon users">
                  <People size={24} />
                </div>
                <div className="summary-info">
                  <h5 className="summary-title">총 회원 수</h5>
                  <h3 className="summary-value">{formatNumber(1100)}</h3>
                  <p className="summary-change positive">
                    <span>+10.2%</span> 전월 대비
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} sm={6} className="mb-4">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon subscriptions">
                  <CreditCard size={24} />
                </div>
                <div className="summary-info">
                  <h5 className="summary-title">활성 구독</h5>
                  <h3 className="summary-value">{formatNumber(320)}</h3>
                  <p className="summary-change positive">
                    <span>+5.7%</span> 전월 대비
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} sm={6} className="mb-4">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon revenue">
                  <CashCoin size={24} />
                </div>
                <div className="summary-info">
                  <h5 className="summary-title">월 매출</h5>
                  <h3 className="summary-value">{formatCurrency(5500000)}</h3>
                  <p className="summary-change positive">
                    <span>+10.0%</span> 전월 대비
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} sm={6} className="mb-4">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon winners">
                  <Trophy size={24} />
                </div>
                <div className="summary-info">
                  <h5 className="summary-title">당첨자 수</h5>
                  <h3 className="summary-value">{formatNumber(42)}</h3>
                  <p className="summary-change negative">
                    <span>-2.3%</span> 전월 대비
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* 차트 */}
        <Row>
          <Col lg={8} className="mb-4">
            <Card className="chart-card">
              <Card.Header>
                <h5 className="chart-title">회원 통계</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userStatData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Legend />
                    <Bar dataKey="users" name="총 회원 수" fill="#8884d8" />
                    <Bar dataKey="newUsers" name="신규 회원" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="chart-card">
              <Card.Header>
                <h5 className="chart-title">구독 분포</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subscriptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col lg={12} className="mb-4">
            <Card className="chart-card">
              <Card.Header>
                <h5 className="chart-title">월별 매출</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="매출"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* 최근 활동 및 알림 */}
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="activity-card">
              <Card.Header>
                <h5 className="card-title">최근 활동</h5>
              </Card.Header>
              <Card.Body>
                <ul className="activity-list">
                  <li className="activity-item">
                    <div className="activity-icon subscription"></div>
                    <div className="activity-content">
                      <div className="activity-title">새로운 구독</div>
                      <div className="activity-text">홍길동님이 Premium 플랜을 구독했습니다.</div>
                      <div className="activity-time">10분 전</div>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon user"></div>
                    <div className="activity-content">
                      <div className="activity-title">신규 회원 가입</div>
                      <div className="activity-text">김철수님이 가입했습니다.</div>
                      <div className="activity-time">35분 전</div>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon payment"></div>
                    <div className="activity-content">
                      <div className="activity-title">결제 완료</div>
                      <div className="activity-text">이영희님이 Standard 플랜을 갱신했습니다.</div>
                      <div className="activity-time">1시간 전</div>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon cancel"></div>
                    <div className="activity-content">
                      <div className="activity-title">구독 취소</div>
                      <div className="activity-text">박민수님이 구독을 취소했습니다.</div>
                      <div className="activity-time">2시간 전</div>
                    </div>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6} className="mb-4">
            <Card className="notification-card">
              <Card.Header>
                <h5 className="card-title">알림</h5>
              </Card.Header>
              <Card.Body>
                <ul className="notification-list">
                  <li className="notification-item important">
                    <div className="notification-icon error"></div>
                    <div className="notification-content">
                      <div className="notification-title">시스템 점검 예정</div>
                      <div className="notification-text">
                        4월 28일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다.
                      </div>
                      <div className="notification-time">1일 전</div>
                    </div>
                  </li>
                  <li className="notification-item">
                    <div className="notification-icon warning"></div>
                    <div className="notification-content">
                      <div className="notification-title">구독 취소율 증가</div>
                      <div className="notification-text">
                        이번 주 구독 취소율이 평소보다 15% 증가했습니다. 확인이 필요합니다.
                      </div>
                      <div className="notification-time">2일 전</div>
                    </div>
                  </li>
                  <li className="notification-item">
                    <div className="notification-icon info"></div>
                    <div className="notification-content">
                      <div className="notification-title">새 공지사항 필요</div>
                      <div className="notification-text">
                        다음 로또 추첨일 변경에 관한 공지사항을 업데이트해야 합니다.
                      </div>
                      <div className="notification-time">3일 전</div>
                    </div>
                  </li>
                  <li className="notification-item">
                    <div className="notification-icon success"></div>
                    <div className="notification-content">
                      <div className="notification-title">월간 목표 달성</div>
                      <div className="notification-text">
                        이번 달 신규 가입자 목표를 달성했습니다! 축하합니다.
                      </div>
                      <div className="notification-time">5일 전</div>
                    </div>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;