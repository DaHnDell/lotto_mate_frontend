import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import background1 from '../../../resources/img/lottomate-background.jpg';
import UseAxios from '../../../hooks/UseAxios';

const HeroSlider = () => {
  const [plans, setPlans] = useState({});
  const [processedPlans, setProcessedPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false); // API 호출 여부를 추적하는 상태 추가
    
  // API 요청을 위한 UseAxios 훅 초기화
  const plansApi = UseAxios();

  // 디폴트 플랜 정보 (API 로딩 실패 시 사용)
  const defaultPlans = useMemo(() => ({
    basic: {
      name: 'BASIC',
      monthlyPrice: 5000,
      popular: false,
      features: [
        "번호 저장 50개",
        "번호 분석 리포트",
        "당첨 문자 알림"
      ],
      highlightFeatures: [
        "주 1회 자동 구매",
        "번호 저장 50개",
        "당첨 문자 알림"
      ],
      description: "초보자를 위한 최적의 선택"
    },
    standard: {
      name: 'STANDARD',
      monthlyPrice: 9000,
      popular: true,
      features: [
        "번호 저장 200개",
        "무제한 번호 추천",
        "주 2회 자동 구매"
      ],
      highlightFeatures: [
        "주 2회 자동 구매",
        "번호 저장 200개",
        "무제한 번호 추천"
      ],
      description: "가장 많은 분들이 선택한 플랜"
    },
    premium: {
      name: 'PREMIUM',
      monthlyPrice: 12000,
      popular: false,
      features: [
        "번호 저장 무제한",
        "1:1 당첨 컨설팅",
        "주 3회 자동 구매"
      ],
      highlightFeatures: [
        "주 3회 자동 구매",
        "번호 저장 무제한",
        "1:1 당첨 컨설팅"
      ],
      description: "당첨을 위한 프리미엄 혜택"
    }
  }), []);

  // 플랜별 고정 설명문 (API 응답과 상관없이 항상 일정하게 표시)
  const planSummaries = useMemo(() => ({
    basic: "초보자를 위한 최적의 선택",
    standard: "가장 많은 분들이 선택한 플랜",
    premium: "당첨을 위한 프리미엄 혜택"
  }), []);

  // 플랜별 핵심 기능 매핑 (플랜 특징에 따라 자동으로 핵심 기능을, 최대 3개까지 보여줌)
  const getHighlights = useCallback((plan) => {
    if (!plan || !plan.features) return [];
    
    // 우선순위가 높은 키워드 (이 키워드가 포함된 기능을 먼저 표시)
    const priorityKeywords = [
      "자동 구매", "번호 저장", "당첨 알림", "번호 추천", "컨설팅", "분석 리포트"
    ];
    
    // 우선순위에 따라 기능 정렬
    const sortedFeatures = [...plan.features].sort((a, b) => {
      const aPriority = priorityKeywords.findIndex(keyword => a.includes(keyword));
      const bPriority = priorityKeywords.findIndex(keyword => b.includes(keyword));
      
      // 둘 다 우선순위 키워드를 포함하면 키워드 순위로 정렬
      if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
      // a만 우선순위 키워드를 포함하면 a가 우선
      if (aPriority !== -1) return -1;
      // b만 우선순위 키워드를 포함하면 b가 우선
      if (bPriority !== -1) return 1;
      // 둘 다 포함하지 않으면 문자열 길이순 (짧은 것 우선)
      return a.length - b.length;
    });
    
    // 최대 3개까지만 반환
    return sortedFeatures.slice(0, 3);
  }, []);

  const fetchActivePlans = useCallback(async () => {
    if (isDataFetched) return; // 이미 데이터를 가져왔으면 중복 호출하지 않음
    
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
            maxLottoNumbers: plan.maxLottoNumbers,
            id: plan.id
          };
        });
        
        setPlans(plansObj);
      }
      
      setError(null);
      setIsDataFetched(true); // 데이터 가져오기 완료 표시
    } catch (err) {
      console.error('구독 플랜 로딩 오류:', err);
      setError('구독 플랜을 불러오는데 실패했습니다.');
      setIsDataFetched(true); // 오류가 나도 다시 시도하지 않도록 표시
    } finally {
      setLoading(false);
    }
  }, [plansApi, isDataFetched]);

  // 컴포넌트 마운트 시 한 번만 API 호출
  useEffect(() => {
    fetchActivePlans();
  }, [fetchActivePlans]);

  // 플랜 데이터가 로드되면 한 번만 처리하여 저장
  useEffect(() => {
    if (!loading && !error && Object.keys(plans).length > 0) {
      // 특징 추출 후 상태 저장
      const processed = {};
      
      Object.keys(plans).forEach(planKey => {
        processed[planKey] = {
          ...plans[planKey],
          highlightFeatures: getHighlights(plans[planKey]),
          description: planSummaries[planKey] || plans[planKey].description || `${plans[planKey].name} 플랜`
        };
      });
      
      setProcessedPlans(processed);
    }
  }, [plans, loading, error, planSummaries, getHighlights]);

  // 최근 당첨 번호
  const latestLotto = {
    round: 1064,
    numbers: [8, 13, 19, 27, 40, 45],
    bonusNumber: 12,
    date: '2025-04-13'
  };

  // 당첨률이 높은 번호 데이터 (예시 데이터)
  const highWinRateNumbers = [
    { number: 34, winRate: 78 },
    { number: 12, winRate: 72 },
    { number: 27, winRate: 69 },
    { number: 7, winRate: 67 },
    { number: 43, winRate: 65 },
    { number: 19, winRate: 63 }
  ];

  // 부드러운 파스텔 색상으로 변경
  const getNumberColor = (number) => {
    if (number <= 10) return '#FFD699'; // 연한 노란색/오렌지색 (1-10)
    if (number <= 20) return '#A3C9E9'; // 연한 파란색 (11-20)
    if (number <= 30) return '#F5B7B1'; // 연한 빨간색/분홍색 (21-30)
    if (number <= 40) return '#BEBEBE'; // 연한 회색 (31-40)
    return '#AACFAB'; // 연한 초록색 (41-45)
  };

  // 슬라이더 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true
        }
      }
    ]
  };

  const imageOpacity = 0.3;

  // 차트를 위한 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            <span>번호: {payload[0].payload.number}</span>
          </p>
          <p className="tooltip-value">
            당첨률: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  // 표시할 플랜 정보 결정
  const displayPlans = Object.keys(processedPlans).length > 0 ? processedPlans : defaultPlans;

  return (
    <section id="hero-slider-section" className="slider-section">
      <div className="slider-wrapper">
        <Slider {...sliderSettings}>
          {/* 슬라이드 1 - 최근 당첨 번호 */}
          <div className="slider-item">
            <div 
              className="slider-image" 
              style={{ 
                backgroundImage: `linear-gradient(rgba(230, 235, 255, ${1 - imageOpacity}), rgba(230, 235, 255, ${1 - imageOpacity})), url(${background1})`,
              }}
            >
              <div className="slider-image-content text-center">
                <Container>
                  <h1>이번 주 당첨 번호는?</h1>
                  <p className='fw-bold'>실시간으로 업데이트되는 당첨 정보를 확인하세요</p>
                  <div className="lotto-round-info mt-2 mb-3">
                    제 {latestLotto.round}회차 ({latestLotto.date})
                  </div>
                  <div className="lotto-number-container d-flex justify-content-center flex-wrap">
                    {latestLotto.numbers.map((num, index) => (
                      <div 
                        className={`lotto-ball lotto-ball-${Math.ceil(num / 10)} mt-3 mx-1`} 
                        key={index}
                        style={{width: '50px', height: '50px'}}
                      >
                        {num}
                      </div>
                    ))}
                    <span className="lotto-plus d-flex align-items-center mx-2 mt-3">+</span>
                    <span className="lotto-ball lotto-ball-bonus mt-3 mx-1" style={{width: '50px', height: '50px'}}>
                      {latestLotto.bonusNumber}
                    </span>
                  </div>
                  <Button as={Link} to="/lotto-results" variant="outline-primary" className="mt-4">
                    지난 회차 보기
                  </Button>
                </Container>
              </div>
            </div>
          </div>
          
          {/* 슬라이드 2 - 당첨률 높은 번호 차트 */}
          <div className="slider-item">
            <div className="slider-image chart-slide">
              <div className="slider-content">
                <Container>
                  <Row className="align-items-center">
                    <Col lg={5} md={12} className="text-center text-lg-start mb-4 mb-lg-0">
                      <h1>최근 당첨률 높은 번호</h1>
                      <p className='fw-bold'>로또메이트 통계 분석 결과, 이 번호들의 당첨 빈도가 높습니다</p>
                      <div className="lotto-balls-container mt-4">
                        {highWinRateNumbers.map((item, index) => (
                          <div 
                            key={index} 
                            className={`lotto-ball lotto-ball-${Math.ceil(item.number / 10)} d-inline-flex`}
                          >
                            {item.number}
                          </div>
                        ))}
                      </div>
                      <Button as={Link} to="/number-generator" variant="primary" size="md" className="mt-4">
                        번호 생성하기
                      </Button>
                    </Col>
                    <Col lg={7} md={12}>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={highWinRateNumbers}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="number" type="category" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="winRate" nameKey="number" radius={[0, 8, 8, 0]}>
                              {highWinRateNumbers.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getNumberColor(entry.number)} />
                              ))}
                              <LabelList dataKey="winRate" position="right" formatter={(value) => `${value}%`} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </div>
          
          {/* 슬라이드 3 - 로또메이트+ 구독 */}
          <div className="slider-item">
            <div className="slider-image premium-slide">
              <div className="slider-content">
                <Container>
                  <Row className="align-items-center">
                    <Col lg={5} md={12} className="text-center text-lg-start mb-4 mb-lg-0">
                      <h1>로또메이트+ 구독</h1>
                      <p className="fw-bold">매주 자동으로 로또번호를 구매하고 관리하세요</p>
                      <p className="premium-feature">✓ 주 1회부터 3회까지 맞춤 구독</p>
                      <p className="premium-feature">✓ AI 기반 번호 추천 서비스</p>
                      <p className="premium-feature">✓ 당첨 즉시 알림 서비스</p>
                      <Button as={Link} to="/premium" variant="primary" size="lg" className="mt-3">
                        구독 시작하기
                      </Button>
                    </Col>
                    <Col lg={7} md={12}>
                      <div className="subscription-plans">
                        <Row className="g-3">
                          {/* 플랜 카드 동적 렌더링 */}
                          {Object.keys(displayPlans).map((planKey) => (
                            <Col md={4} key={planKey}>
                              <div className={`plan-card h-100 ${displayPlans[planKey].popular ? 'popular' : ''}`}>
                                {displayPlans[planKey].popular && <div className="popular-badge">인기</div>}
                                <div className="plan-header">
                                  <h3>{displayPlans[planKey].name}</h3>
                                  <p className="plan-price">
                                    ₩{displayPlans[planKey].monthlyPrice.toLocaleString()}<span>/월</span>
                                  </p>
                                </div>
                                <div className="plan-body" style={{ minHeight: '180px' }}>
                                  <div style={{ height: '120px' }}>
                                    {(displayPlans[planKey].highlightFeatures || []).map((feature, index) => (
                                      <p key={index} className="plan-feature" style={{ marginBottom: '0.5rem', height: '24px', overflow: 'hidden' }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>{feature}
                                      </p>
                                    ))}
                                  </div>
                                  <div className="plan-highlight mt-3">
                                    <p className="mb-0">{displayPlans[planKey].description}</p>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default HeroSlider;