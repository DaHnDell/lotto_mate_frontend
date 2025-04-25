/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Accordion, Table, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleFill, XCircleFill, StarFill, CreditCard, Lightning, Gift, QuestionCircleFill } from 'react-bootstrap-icons';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PaymentService from '../../services/PaymentService';
import UseAxios from '../../hooks/UseAxios';
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


const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isPortOneLoaded, setIsPortOneLoaded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // const [user, setUser] = useState({email: '', name: '', phone: ''});
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  // API 요청을 위한 UseAxios 훅 초기화
  const plansApi = UseAxios();
  const navigate = useNavigate();
  const paymentService = PaymentService();

  const fetchActivePlans = useCallback(async () => {
    try {
      setLoading(true);
      const activePlans = await plansApi.req('GET', 'subscription/plans/active');
      
      if (activePlans && activePlans.length > 0) {
        // API 응답을 플랜 객체로 변환
        const plansObj = {};
        activePlans.forEach(plan => {
          const planKey = plan.name.toLowerCase();
          
          plansObj[planKey] = {
            name: plan.name.toUpperCase(),
            monthlyPrice: plan.durationMonths <= 1 ? plan.price : plan.price / plan.durationMonths,
            yearlyPrice: plan.durationMonths <= 1 ? plan.price * 10 : plan.price, // 연간 구독은 월간의 10배 (2개월 무료)
            popular: planKey === 'standard', // 'standard' 플랜을 인기 플랜으로 표시
            features: plan.features ? plan.features.split(',').map(feature => feature.trim()) : [],
            notIncluded: [], // 초기화
            maxLottoNumbers: plan.maxLottoNumbers,
            description: plan.description,
            id: plan.id
          };
        });
        
        // notIncluded 속성 설정 (상위 플랜에만 있는 기능)
        const allFeatures = new Set();
        Object.values(plansObj).forEach(plan => {
          plan.features.forEach(feature => allFeatures.add(feature));
        });
        
        // 각 플랜별로 notIncluded 설정
        Object.keys(plansObj).forEach(planKey => {
          const currentPlanFeatures = new Set(plansObj[planKey].features);
          plansObj[planKey].notIncluded = Array.from(allFeatures).filter(
            feature => !currentPlanFeatures.has(feature)
          );
        });
        
        setPlans(plansObj);
        
        // 기본 선택 플랜 설정 (standard 또는 첫 번째 플랜)
        if (plansObj.standard) {
          setSelectedPlan('standard');
        } else if (Object.keys(plansObj).length > 0) {
          setSelectedPlan(Object.keys(plansObj)[0]);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('구독 플랜 로딩 오류:', err);
      setError('구독 플랜을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [plansApi]);

  // 활성화된 구독 플랜 조회
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchActivePlans()
        ]);
        setError(null);
      } catch (err) {
        console.error('초기 데이터 로딩 오류:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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
    // 로컬 스토리지에서 직접 이메일 가져오기
    const email = localStorage.getItem("email");
    
    // 로그인 체크 - 상태 변수(user)가 아닌 직접 로컬 스토리지 값 확인
    if (!email) {
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
      IMP.init('imp70056657'); // 포트원에서 발급받은 가맹점 식별코드
      
      // 결제 데이터 준비
      const selectedPlanData = plans[selectedPlan];
      const price = billingPeriod === 'monthly' 
        ? selectedPlanData.monthlyPrice 
        : selectedPlanData.yearlyPrice;
      
      // 고유 주문번호 생성
      const merchantUid = `subscription_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;
      
      // 결제 요청
      IMP.request_pay({
        pg: 'tosspayments', // PG사 (실제 계약한 PG사로 변경)
        pay_method: 'card', // 결제 수단
        merchant_uid: merchantUid, // 주문번호
        name: `로또메이트+ ${selectedPlanData.name} ${billingPeriod === 'monthly' ? '월간' : '연간'} 구독`, // 주문명
        amount: price, // 결제금액
        buyer_email: email || '', 
        buyer_name: '', 
        buyer_tel: '', 
        // 정기결제 설정 (월간 구독에만 적용)
        ...(billingPeriod === 'monthly' && {
          period: {
            interval: "1", // 1개월마다
            interval_count: "1", // 1회씩
            start_date: new Date().toISOString().split('T')[0].replace(/-/g, ''), // YYYYMMDD 형식
            end_date: '' // 무제한
          }
        })
      }, async function(response) {
        if (response.success) {
          try {
            // 결제 검증 및 구독 정보 저장
            const subscriptionInfo = {
              imp_uid: response.imp_uid,
              merchant_uid: response.merchant_uid,
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

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="premium-page">
        <Header />
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
          <p className="mt-3">구독 플랜 정보를 불러오는 중입니다...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // 오류 표시
  if (error || Object.keys(plans).length === 0) {
    return (
      <div className="premium-page">
        <Header />
        <div className="container my-5 py-5">
          <div className="alert alert-danger text-center">
            <h4 className="alert-heading">오류 발생</h4>
            <p>{error || '구독 플랜 정보를 불러올 수 없습니다.'}</p>
            <hr />
            <p className="mb-0">잠시 후 다시 시도해주세요.</p>
            <button className="btn btn-outline-danger mt-3" onClick={() => window.location.reload()}>
              새로고침
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          {selectedPlan && (
            <div className="selected-plan-summary mt-5 p-4">
              <Row className="align-items-center">
                <Col md={6}>
                  <h4 className="mb-2">선택한 구독 정보</h4>
                  <p className="selected-plan-details">
                    <strong>{plans[selectedPlan].name}</strong> 플랜, {billingPeriod === 'monthly' ? '월간' : '연간'} 결제
                  </p>
                  <ul className="selected-plan-features">
                    {/* <li>
                      <CheckCircleFill className="me-2 text-success" />
                      저장 번호 {plans[selectedPlan].maxLottoNumbers === -1 ? '무제한' : plans[selectedPlan].maxLottoNumbers.toLocaleString() + '개'}
                    </li>
                    <li>
                      <CheckCircleFill className="me-2 text-success" />
                      {billingPeriod === 'monthly' ? '매월' : '매년'} 자동 갱신 (언제든지 취소 가능)
                    </li>
                    <li>
                      <CheckCircleFill className="me-2 text-success" />
                      즉시 프리미엄 기능 이용 가능
                    </li> */}
                    <li>
                      {plans[selectedPlan].description}
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
          )}
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
                  {Object.keys(plans).map(planKey => (
                    <th key={planKey} className="text-center">{plans[planKey].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 모든 플랜의 기능을 고유한 특성으로 변환 */}
                {getAllFeatures(plans).map((feature, index) => (
                  <tr key={index}>
                    <td>{feature}</td>
                    <td className="text-center">
                      {feature === '번호 저장 개수' ? 
                        '10개' : 
                        <XCircleFill className="text-danger" />
                      }
                    </td>
                    {Object.keys(plans).map(planKey => (
                      <td key={planKey} className="text-center">
                        {renderFeatureValue(plans[planKey], feature)}
                      </td>
                    ))}
                  </tr>
                ))}
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

// 모든 플랜에서 제공하는 고유한 기능 목록 추출
const getAllFeatures = (plans) => {
  const allFeatures = new Set();
  const basicFeatures = [
    '광고 제거', 
    '자동 번호 구매', 
    '번호 저장 개수', 
    '번호 분석 리포트', 
    '당첨 문자 알림', 
    '무제한 번호 추천', 
    '1:1 당첨 컨설팅', 
    '우선 고객 지원'
  ];
  
  // 기본 기능들 추가
  basicFeatures.forEach(feature => allFeatures.add(feature));
  
  // 각 플랜의 특별한 기능들 추가
  Object.values(plans).forEach(plan => {
    plan.features.forEach(feature => {
      if (!basicFeatures.includes(feature)) {
        allFeatures.add(feature);
      }
    });
  });
  
  return Array.from(allFeatures);
};

// 기능 값 렌더링 (O, X, 또는 커스텀 값)
const renderFeatureValue = (plan, feature) => {
  // 플랜이 해당 기능을 포함하는지 확인
  const hasFeature = plan.features.some(f => 
    f.includes(feature) || feature.includes(f)
  );
  
  if (feature === '번호 저장 개수') {
    // 번호 저장 개수 특수 처리
    const feature = plan.features.find(f => f.includes('번호 저장'));
    if (feature) {
      if (feature.includes('무제한')) {
        return '무제한';
      } else {
        const count = feature.match(/\d+/);
        return count ? `${count[0]}개` : '50개';
      }
    } else {
      return '10개';
    }
  } else if (feature === '자동 번호 구매') {
    // 자동 번호 구매 특수 처리
    const feature = plan.features.find(f => f.includes('자동 번호 구매'));
    if (feature) {
      const count = feature.match(/\d+/);
      return count ? `주 ${count[0]}회` : '주 1회';
    } else {
      return <XCircleFill className="text-danger" />;
    }
  } else {
    // 일반 기능들
    return hasFeature ? 
      <CheckCircleFill className="text-success" /> : 
      <XCircleFill className="text-danger" />;
  }
};

export default Premium;