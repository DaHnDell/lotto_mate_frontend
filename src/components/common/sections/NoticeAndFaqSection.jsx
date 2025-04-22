import React from 'react';
import { Container, Row, Col, Card, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BellFill, QuestionCircleFill } from 'react-bootstrap-icons';

const NoticeAndFaqSection = () => {
  // 공지사항 임시 데이터
  const noticeData = [
    {
      id: 301,
      title: "로또메이트 시스템 업데이트 안내",
      date: "2025-04-15",
      summary: "4월 18일 새벽 2시부터 4시까지 서버 점검이 예정되어 있습니다.",
      important: true
    },
    {
      id: 300,
      title: "로또메이트+ 새로운 기능 출시 안내",
      date: "2025-04-10",
      summary: "프리미엄 회원을 위한 AI 번호 분석 기능이 추가되었습니다.",
      important: false
    },
    {
      id: 299,
      title: "로또 당첨금 입금 관련 유의사항",
      date: "2025-04-03",
      summary: "로또 당첨금 수령 시 필요한 서류와 절차를 안내해 드립니다.",
      important: true
    }
  ];

  // FAQ 임시 데이터
  const faqData = [
    {
      id: 1,
      question: "로또메이트+ 프리미엄 서비스는 어떤 혜택이 있나요?",
      answer: "로또메이트+ 프리미엄 서비스는 AI 기반 번호 추천, 당첨 확률 분석, 번호 저장 개수 무제한, 광고 제거 등의 혜택을 제공합니다. 월 구독과 연간 구독 두 가지 옵션이 있으며, 연간 구독 시 20% 할인 혜택이 적용됩니다."
    },
    {
      id: 2,
      question: "로또 번호를 저장하면 어떤 점이 좋은가요?",
      answer: "로또 번호를 저장하면 과거에 선택했던 번호를 쉽게 확인할 수 있고, 당첨 결과를 자동으로 확인해 드립니다. 또한 번호별 통계와 분석 정보를 제공해 더 나은 번호 선택에 도움을 드립니다."
    },
    {
      id: 3,
      question: "당첨 번호 알림은 어떻게 설정하나요?",
      answer: "마이페이지 > 알림 설정에서 당첨 번호 알림을 설정할 수 있습니다. 로그인 후 알림 받기를 활성화하면 추첨 직후 이메일이나 앱 푸시 알림으로 당첨 결과를 받아보실 수 있습니다."
    }
  ];

  // FAQ Accordion 활성화 상태 관리
  // const [activeKey, setActiveKey] = useState('0');

  return (
    <section id="notice-faq-section" className="notice-faq-section bg-light py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={10} className="text-center">
            <h2 className="section-title">공지사항 및 자주 묻는 질문</h2>
            <p className="section-subtitle">
              로또메이트의 최신 소식과 자주 묻는 질문을 확인해보세요
            </p>
          </Col>
        </Row>

        {/* 공지사항 섹션 */}
        <Row className="mb-5">
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold d-flex align-items-center">
                <BellFill className="text-primary me-2" /> 공지사항
              </h3>
              <Button as={Link} to="/notices" variant="outline-primary" size="sm">
                전체보기
              </Button>
            </div>

            <Row>
              {noticeData.map((notice) => (
                <Col md={4} className="mb-4" key={notice.id}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <small className="text-muted">{notice.date}</small>
                        {notice.important && (
                          <span className="badge bg-success">중요</span>
                        )}
                      </div>
                      <Card.Title className="fw-bold h5 mb-3">
                        {notice.title}
                      </Card.Title>
                      <Card.Text className="text-secondary fw-bold">
                        {notice.summary}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <Button 
                        as={Link} 
                        to={`/notices/${notice.id}`} 
                        variant="link" 
                        className="text-primary p-0 fw-bold"
                        size='sm'
                      >
                        자세히 보기 &gt;
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* FAQ 섹션 */}
        <Row>
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold d-flex align-items-center">
                <QuestionCircleFill className="text-primary me-2" /> 자주 묻는 질문
              </h3>
              <Button as={Link} to="/faq" variant="outline-primary" size="sm">
                전체보기
              </Button>
            </div>

            <Accordion defaultActiveKey="0" className="shadow-sm">
              {faqData.map((faq, index) => (
                <Accordion.Item eventKey={index.toString()} key={faq.id}>
                  <Accordion.Header>
                    <span className="fw-bold">{faq.question}</span>
                  </Accordion.Header>
                  <Accordion.Body className="bg-white">
                    <p className="mb-0">{faq.answer}</p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NoticeAndFaqSection;