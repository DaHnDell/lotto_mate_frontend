import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// 슬라이더 이미지 (실제 구현 시 이미지 파일 경로로 변경)
const slide1Image = 'https://via.placeholder.com/1200x500';
const slide3Image = 'https://via.placeholder.com/1200x500';

const HeroSlider = () => {
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
    autoplaySpeed: 2000,
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

  return (
    <section id="hero-slider-section" className="slider-section">
      <div className="slider-wrapper">
        <Slider {...sliderSettings}>
          {/* 슬라이드 1 */}
          <div className="slider-item">
            <div 
              className="slider-image" 
              style={{ backgroundImage: `url(${slide1Image})` }}
            >
              <div className="slider-content">
                <Container>
                  <h1>이번 주 당첨 번호는?</h1>
                  <p className='fw-bold'>실시간으로 업데이트되는 당첨 정보를 확인하세요</p>
                  {latestLotto.numbers.map((num, index) => (
                    <div 
                      className={`lotto-ball lotto-ball-${Math.ceil(num / 10)} mt-3`} 
                      key={index}
                      style={{width: '50px', height: '50px'}}
                    >
                      {num}
                    </div>
                  ))}
                  <span className="lotto-plus">+</span>
                  <span className="lotto-ball lotto-ball-bonus" style={{width: '50px', height: '50px'}}>
                    {latestLotto.bonusNumber}
                  </span>
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
                            // style={{ backgroundColor: getNumberColor(item.number) }}
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
                        <ResponsiveContainer width="100%" height="100%">
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
          
          {/* 슬라이드 3 */}
          <div className="slider-item">
            <div 
              className="slider-image" 
              style={{ backgroundImage: `url(${slide3Image})` }}
            >
              <div className="slider-content">
                <Container>
                  <h1>로또메이트+ 구독</h1>
                  <p className='fw-bold'>프리미엄 기능으로 당첨 확률을 높여보세요</p>
                  <Button as={Link} to="/premium" variant="primary" size="lg">
                    프리미엄 혜택 보기
                  </Button>
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