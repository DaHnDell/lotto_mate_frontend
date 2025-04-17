import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Accordion, Table, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleFill, XCircleFill, StarFill, CreditCard, Lightning, Gift, QuestionCircleFill } from 'react-bootstrap-icons';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PaymentService from '../../services/PaymentService';
// import { useAuth } from '../../hooks/AuthContext';
import '../../resources/css/style.css';

// 포트원 SDK 스크립트 추가
const loadPortOneScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error('포트원 스크립트 로드에 실패했습니다.'));
    document.head.appendChild(script);
  });
};

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isPortOneLoaded, setIsPortOneLoaded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [user, setUser] = useState({email: '', name: '', phone: ''});

  // const { user } = useAuth();
  const navigate = useNavigate();
  const paymentService = PaymentService();

  // 구독 요금제 정보
  const plans = {
    basic: {
      name: 'BASIC',
      monthlyPrice: 5000,
      yearlyPrice: 50000, // 연간 구독 시 12개월 가격 (2개월 무료)
      features: [
        '주 1회 자동 번호 구매',
        '번호 분석 리포트',
        '당첨 문자 알림',
        '광고 제거',
        '번호 저장 50개'
      ],
      notIncluded: [
        '무제한 번호 추천',
        '1:1 당첨 컨설팅',
        '우선 고객 지원'
      ]
    },
    standard: {
      name: 'STANDARD',
      monthlyPrice: 9000,
      yearlyPrice: 90000,
      popular: true,
      features: [
        '주 2회 자동 번호 구매',
        '번호 분석 리포트',
        '당첨 문자 알림',
        '광고 제거',
        '번호 저장 200개',
        '무제한 번호 추천'
      ],
      notIncluded: [
        '1:1 당첨 컨설팅'
      ]
    },
    premium: {
      name: 'PREMIUM',
      monthlyPrice: 12000,
      yearlyPrice: 120000,
      features: [
        '주 3회 자동 번호 구매',
        '번호 분석 리포트',
        '당첨 문자 알림',
        '광고 제거',
        '번호 저장 무제한',
        '무제한 번호 추천',
        '1:1 당첨 컨설팅',
        '우선 고객 지원'
      ],
      notIncluded: []
    }
  };

  // 자주 묻는 질문 데이터
  const faqData = [
    {
      question: "로또메이트+ 구독은 언제든지 취소할 수 있나요?",
      answer: "네, 로또메이트+ 구독은 언제든지 취소할 수 있습니다. 구독 취소 시 현재 구독 기간이 종료될 때까지 서비스를 이용하실 수 있으며, 다음 결제일에 자동 갱신되지 않습니다."
    },
    {
      question: "자동 번호 구매는 어떻게 작동하나요?",
      answer: "자동 번호 구매는 로또 구매 마감 시간 전에 AI가 분석한 번호로 자동 생성됩니다. 생성된 번호는 앱에서 확인하실 수 있으며, 당첨 결과도 자동으로 알려드립니다. 실제 복권 구매는 사용자가 직접 하셔야 합니다."
    },
    {
      question: "무제한 번호 추천은 하루에 몇 번까지 이용할 수 있나요?",
      answer: "무제한 번호 추천은 말 그대로 무제한입니다. 하루에 원하시는 만큼 새로운 번호 조합을 생성하고 저장하실 수 있습니다. 다양한 알고리즘 기반의 번호 추천 기능도 모두 이용 가능합니다."
    },
    {
      question: "연간 구독과 월간 구독의 차이점은 무엇인가요?",
      answer: "연간 구독은 1년치 요금을 한 번에 결제하여 2개월 무료 혜택을 받는 방식입니다. 월간 구독에 비해 약 16.7% 할인된 가격으로 이용하실 수 있습니다. 그 외 제공되는 서비스 내용은 동일합니다."
    },
    {
      question: "1:1 당첨 컨설팅은 어떤 서비스인가요?",
      answer: "1:1 당첨 컨설팅은 로또 전문가와의 1:1 상담을 통해 개인화된 번호 추천과 전략을 제공받는 서비스입니다. 월 1회 30분간 화상 또는 채팅으로 상담을 진행하며, 프리미엄 플랜 구독자만 이용 가능합니다."
    }
  ];

  // 포트원 SDK 로드
  useEffect(() => {
    const loadScript = async () => {
      try {
        const script = await loadPortOneScript();
        setIsPortOneLoaded(true);
        return () => {
          document.head.removeChild(script);
        };
      } catch (error) {
        console.error('포트원 스크립트 로드 실패:', error);
        alert('결제 모듈을 불러오는데 실패했습니다. 페이지를 새로 고침해주세요.');
      }
    };
    
    loadScript();
  }, []);

  // 요금제 선택 핸들러
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // 구독 기간 변경 핸들러
  const handleBillingPeriodChange = (period) => {
    setBillingPeriod(period);
  };

  // 구독하기 버튼 클릭 핸들러
  const handleSubscribe = async () => {
    setUser({email: 'sophia76256@gmail.com', name: '허정윤', phone: '010-1234-5678'});

    // 로그인 체크
    if (!user) {
      alert('구독을 시작하려면 로그인이 필요합니다.');
      navigate('/login', { state: { from: '/premium' } });
      return;
    }
    
    if (!isPortOneLoaded) {
      alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      const { IMP } = window;
      // 가맹점 식별코드 초기화
      IMP.init('your_imp_code'); // 포트원에서 발급받은 가맹점 식별코드
      
      // 결제 데이터 준비
      const selectedPlanData = plans[selectedPlan];
      const price = billingPeriod === 'monthly' 
        ? selectedPlanData.monthlyPrice 
        : selectedPlanData.yearlyPrice;
      
      // 고유 주문번호 생성
      const merchantUid = `subscription_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;
      
      // 결제 요청
      IMP.request_pay({
        pg: 'inicis', // PG사 (실제 계약한 PG사로 변경)
        pay_method: 'card', // 결제 수단
        merchant_uid: merchantUid, // 주문번호
        name: `로또메이트+ ${selectedPlanData.name} ${billingPeriod === 'monthly' ? '월간' : '연간'} 구독`, // 주문명
        amount: price, // 결제금액
        buyer_email: user.email || '', // 구매자 이메일
        buyer_name: user.name || '', // 구매자 이름
        buyer_tel: user.phone || '', // 구매자 전화번호
        // 정기결제 설정 (월간 구독에만 적용)
        ...(billingPeriod === 'monthly' && {
          period: {
            interval: 1, // 1개월마다
            interval_count: 1, // 1회씩
            start_date: new Date().toISOString().split('T')[0].replace(/-/g, ''), // YYYYMMDD 형식
            end_date: '' // 무제한
          }
        })
      }, async function(response) {
        if (response.success) {
          try {
            // 결제 검증 및 구독 정보 저장
            const subscriptionInfo = {
              plan: selectedPlan,
              period: billingPeriod,
              amount: price
            };
            
            const result = await paymentService.verifyPaymentAndCreateSubscription(
              { imp_uid: response.imp_uid, merchant_uid: response.merchant_uid },
              subscriptionInfo
            );
            
            // 구독 완료 페이지로 이동
            navigate('/subscription/complete', { 
              state: { 
                impUid: response.imp_uid,
                subscriptionId: result.subscriptionId 
              } 
            });
          } catch (error) {
            console.error('결제 검증 실패:', error);
            alert('결제는 성공했으나 서버에서 검증에 실패했습니다. 고객센터에 문의해주세요.');
          }
        } else {
          // 결제 실패 시 처리
          console.error('결제 실패', response);
          alert(`결제에 실패했습니다: ${response.error_msg}`);
        }
      });
    } catch (error) {
      console.error('결제 프로세스 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="premium-page">
      <Header />
      
      <div className="premium-hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={10} lg={8}>
              <h1 className="premium-hero-title">로또메이트+로 당첨 확률을 높이세요</h1>
              <p className="premium-hero-subtitle">
                AI 기반 번호 추천, 자동 번호 관리, 당첨 알림 서비스를 이용해보세요
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="mt-4 hero-cta-button"
                href="#pricing-section"
              >
                지금 시작하기
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* 주요 혜택 섹션 */}
      <section className="benefits-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">로또메이트+의 특별한 혜택</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="benefit-card text-center">
                <div className="benefit-icon">
                  <Lightning size={48} />
                </div>
                <h3 className="benefit-title">AI 번호 추천</h3>
                <p className="benefit-description">
                  빅데이터와 AI 알고리즘을 활용한 맞춤형 번호 추천 서비스로 당첨 확률을 높여보세요.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="benefit-card text-center">
                <div className="benefit-icon">
                  <CreditCard size={48} />
                </div>
                <h3 className="benefit-title">자동 번호 구매</h3>
                <p className="benefit-description">
                  주 1~3회 자동으로 번호를 생성하고 관리해드립니다. 당첨 결과도 바로 확인하세요.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="benefit-card text-center">
                <div className="benefit-icon">
                  <Gift size={48} />
                </div>
                <h3 className="benefit-title">프리미엄 혜택</h3>
                <p className="benefit-description">
                  광고 제거, 번호 저장 공간 확장, 1:1 컨설팅 등 다양한 프리미엄 혜택을 누려보세요.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* 요금제 비교 섹션 */}
      <section id="pricing-section" className="pricing-section py-5">
        <Container>
          <h2 className="section-title text-center mb-3">구독 요금제</h2>
          <p className="section-subtitle text-center mb-5">나에게 맞는 플랜을 선택하고 로또메이트+의 모든 혜택을 누려보세요</p>
          
          {/* 결제 주기 선택 토글 */}
          <div className="billing-toggle text-center mb-5">
            <span className={`billing-period ${billingPeriod === 'monthly' ? 'active' : ''}`}>
              월간 결제
            </span>
            <Form.Check 
              type="switch"
              id="billing-period-switch"
              className="d-inline-block mx-3"
              onChange={() => handleBillingPeriodChange(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              checked={billingPeriod === 'yearly'}
            />
            <span className={`billing-period ${billingPeriod === 'yearly' ? 'active' : ''}`}>
              연간 결제 <Badge bg="success">2개월 무료</Badge>
            </span>
          </div>
          
          {/* 요금제 카드 */}
          <Row className="pricing-cards">
            {Object.keys(plans).map((planKey) => {
              const plan = plans[planKey];
              return (
                <Col md={4} key={planKey} className="mb-4">
                  <Card 
                    className={`pricing-card ${selectedPlan === planKey ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                    onClick={() => handlePlanSelect(planKey)}
                  >
                    {plan.popular && <div className="popular-badge">인기</div>}
                    <Card.Header className="text-center">
                      <h3 className="plan-name">{plan.name}</h3>
                    </Card.Header>
                    <Card.Body>
                      <div className="price-container text-center">
                        <span className="price-currency">₩</span>
                        <span className="price-amount">
                          {billingPeriod === 'monthly' 
                            ? plan.monthlyPrice.toLocaleString() 
                            : Math.round(plan.yearlyPrice / 12).toLocaleString()}
                        </span>
                        <span className="price-period">/ 월</span>
                      </div>
                      {billingPeriod === 'yearly' && (
                        <div className="yearly-price text-center mb-3">
                          연 {plan.yearlyPrice.toLocaleString()}원 (2개월 무료)
                        </div>
                      )}
                      <ul className="feature-list">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="feature-item">
                            <CheckCircleFill className="feature-icon included" /> {feature}
                          </li>
                        ))}
                        {plan.notIncluded.map((feature, index) => (
                          <li key={index} className="feature-item not-included">
                            <XCircleFill className="feature-icon not-included" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                    <Card.Footer className="text-center">
                      <Button 
                        variant={selectedPlan === planKey ? "primary" : "outline-primary"} 
                        className="w-100 select-plan-btn"
                        onClick={() => handlePlanSelect(planKey)}
                      >
                        {selectedPlan === planKey ? '선택됨' : '선택하기'}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
          
          {/* 선택된 플랜 요약 */}
          <div className="selected-plan-summary mt-5 p-4">
            <Row className="align-items-center">
              <Col md={6}>
                <h4 className="mb-2">선택한 구독 정보</h4>
                <p className="selected-plan-details">
                  <strong>{plans[selectedPlan].name}</strong> 플랜, {billingPeriod === 'monthly' ? '월간' : '연간'} 결제
                </p>
                <ul className="selected-plan-features">
                  <li>
                    <CheckCircleFill className="me-2 text-success" />
                    주 {selectedPlan === 'basic' ? '1' : selectedPlan === 'standard' ? '2' : '3'}회 자동 번호 구매
                  </li>
                  <li>
                    <CheckCircleFill className="me-2 text-success" />
                    {billingPeriod === 'monthly' ? '매월' : '매년'} 자동 갱신 (언제든지 취소 가능)
                  </li>
                  <li>
                    <CheckCircleFill className="me-2 text-success" />
                    즉시 프리미엄 기능 이용 가능
                  </li>
                </ul>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="total-price-container">
                  <span className="total-price-label">총 금액: </span>
                  <span className="total-price-amount">
                    ₩{billingPeriod === 'monthly' 
                        ? plans[selectedPlan].monthlyPrice.toLocaleString() 
                        : plans[selectedPlan].yearlyPrice.toLocaleString()}
                  </span>
                  <span className="total-price-period">
                    / {billingPeriod === 'monthly' ? '월' : '년'}
                  </span>
                </div>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="mt-3 subscribe-btn"
                  onClick={handleSubscribe}
                  disabled={isProcessingPayment || !isPortOneLoaded}
                >
                  {isProcessingPayment ? '처리 중...' : '구독하기'}
                </Button>
                <p className="subscription-note mt-2">
                  구독 즉시 프리미엄 기능이 활성화됩니다
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
      
      {/* 플랜 비교표 섹션 */}
      <section className="plan-comparison-section py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">플랜 비교표</h2>
          <div className="table-responsive">
            <Table className="plan-comparison-table">
              <thead>
                <tr>
                  <th>기능</th>
                  <th className="text-center">기본 회원</th>
                  <th className="text-center">BASIC</th>
                  <th className="text-center">STANDARD</th>
                  <th className="text-center">PREMIUM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>광고 제거</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                </tr>
                <tr>
                  <td>자동 번호 구매</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center">주 1회</td>
                  <td className="text-center">주 2회</td>
                  <td className="text-center">주 3회</td>
                </tr>
                <tr>
                  <td>번호 저장 개수</td>
                  <td className="text-center">10개</td>
                  <td className="text-center">50개</td>
                  <td className="text-center">200개</td>
                  <td className="text-center">무제한</td>
                </tr>
                <tr>
                  <td>번호 분석 리포트</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                </tr>
                <tr>
                  <td>당첨 문자 알림</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                </tr>
                <tr>
                  <td>무제한 번호 추천</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                </tr>
                <tr>
                  <td>1:1 당첨 컨설팅</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                </tr>
                <tr>
                  <td>우선 고객 지원</td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><XCircleFill className="text-danger" /></td>
                  <td className="text-center"><CheckCircleFill className="text-success" /></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Container>
      </section>
      
      {/* 사용자 후기 섹션 */}
      <section className="testimonials-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">사용자 후기</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                </div>
                <p className="testimonial-content">
                  "로또메이트+ 구독 후 3등 당첨이 두 번이나 있었어요! AI 번호 추천 기능이 정말 대단합니다. 주 3회 자동 구매 덕분에 번호 선택 고민도 없어졌어요."
                </p>
                <div className="testimonial-author">
                  <p className="author-name">김정민님</p>
                  <p className="subscription-info">프리미엄 회원 · 6개월 이용</p>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                </div>
                <p className="testimonial-content">
                  "매주 번호를 고르는 번거로움이 사라졌어요. 스탠다드 플랜으로 시작했는데 만족도가 높아서 프리미엄으로 업그레이드했습니다. 1:1 컨설팅도 많은 도움이 되었어요."
                </p>
                <div className="testimonial-author">
                  <p className="author-name">이지현님</p>
                  <p className="subscription-info">프리미엄 회원 · 1년 이용</p>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                  <StarFill className="star-icon" />
                </div>
                <p className="testimonial-content">
                  "기본 플랜만으로도 충분히 만족스러워요. 매주 받는 번호 분석 리포트가 정말 꼼꼼하고 도움이 많이 됩니다. 앱도 광고 없이 깔끔해서 좋아요."
                </p>
                <div className="testimonial-author">
                  <p className="author-name">박준호님</p>
                  <p className="subscription-info">베이직 회원 · 3개월 이용</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* FAQ 섹션 */}
      <section className="faq-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="section-title text-center mb-5">
                <QuestionCircleFill className="me-2" />
                자주 묻는 질문
              </h2>
              <Accordion defaultActiveKey="0" className="faq-accordion">
                {faqData.map((item, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{item.question}</Accordion.Header>
                    <Accordion.Body>{item.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
              <div className="text-center mt-4">
                <p>더 궁금한 점이 있으신가요?</p>
                <Button as={Link} to="/contact" variant="outline-primary">
                  문의하기
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* CTA 섹션 */}
      <section className="cta-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="cta-title">지금 로또메이트+를 시작해보세요</h2>
              <p className="cta-subtitle">
                언제든지 취소 가능하며, 첫 7일은 무료로 체험해보실 수 있습니다
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="mt-4 cta-button"
                href="#pricing-section"
              >
                무료 체험 시작하기
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default Premium;