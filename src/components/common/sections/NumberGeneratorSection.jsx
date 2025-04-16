import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Shuffle } from 'react-bootstrap-icons';

const NumberGeneratorSection = () => {
  // 사용자 선택 번호 상태
  const [userNumbers, setUserNumbers] = useState(Array(45).fill(false));
  const [selectedCount, setSelectedCount] = useState(0);
  
  // 랜덤 생성 번호 상태
  const [randomNumbers, setRandomNumbers] = useState([]);
  
  // 인기 번호 상태 (실제로는 API에서 가져올 수 있음)
  // const [popularNumbers, setPopularNumbers] = useState([3, 11, 23, 28, 33, 45]);
  const popularNumbers = [3, 11, 23, 28, 33, 45];
  
  // 컴포넌트 마운트 시 랜덤 번호 생성
  useEffect(() => {
    generateRandomNumbers();
  }, []);
  
  // 사용자 번호 선택 처리
  const handleNumberSelect = (index) => {
    if (userNumbers[index] || selectedCount < 6) {
      const newUserNumbers = [...userNumbers];
      newUserNumbers[index] = !newUserNumbers[index];
      setUserNumbers(newUserNumbers);
      
      // 선택된 번호 개수 업데이트
      setSelectedCount(newUserNumbers.filter(selected => selected).length);
    }
  };
  
  // 랜덤 번호 생성 함수
  const generateRandomNumbers = () => {
    const numbers = [];
    while (numbers.length < 6) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    // 오름차순 정렬
    numbers.sort((a, b) => a - b);
    setRandomNumbers(numbers);
  };
  
  // 사용자 선택 번호 초기화
  const resetUserSelection = () => {
    setUserNumbers(Array(45).fill(false));
    setSelectedCount(0);
  };
  
  // 번호 색상 결정 함수
  const getBallColorClass = (number) => {
    if (number <= 10) return 'lotto-ball-1';
    if (number <= 20) return 'lotto-ball-2';
    if (number <= 30) return 'lotto-ball-3';
    if (number <= 40) return 'lotto-ball-4';
    return 'lotto-ball-5';
  };
  
  return (
    <section id="number-generator-section" className="number-generator-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={10} className="text-center">
            <h2 className="section-title">로또 번호 생성기</h2>
            <p className="section-subtitle">
              나만의 행운의 번호를 직접 고르거나 랜덤으로 생성하세요
            </p>
          </Col>
        </Row>
        
        <Row>
          {/* 좌측: 사용자 선택 번호 */}
          <Col lg={6} className="mb-5 mb-lg-0">
            <div className="user-selection-container bg-white p-4 shadow-sm rounded">
              <h3 className="selection-title mb-3">직접 뽑기</h3>
              <p className="selection-info mb-4">
                1부터 45까지의 숫자 중 6개를 선택하세요.
                <span className="selection-count ms-2">
                  {selectedCount}/6개 선택됨
                </span>
              </p>
              
              <div className="number-grid mb-4">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((number) => (
                  <Button
                    key={number}
                    variant={userNumbers[number - 1] ? "primary" : "outline-secondary"}
                    className={`number-btn ${userNumbers[number - 1] ? 'selected' : ''}`}
                    onClick={() => handleNumberSelect(number - 1)}
                    disabled={selectedCount >= 6 && !userNumbers[number - 1]}
                  >
                    {number}
                  </Button>
                ))}
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                {selectedCount === 0 ? 
                  <></> : 
                  <Button 
                    variant="outline-danger" 
                    onClick={resetUserSelection}
                    size='sm'
                  >
                    초기화
                  </Button>
                }
                
                <div className="selected-numbers-display">
                  {userNumbers.map((selected, index) => 
                    selected && (
                      <span 
                        key={index} 
                        className={`lotto-ball ${getBallColorClass(index + 1)}`}
                      >
                        {index + 1}
                      </span>
                    )
                  )}
                </div>
              </div>
              
              <div className="save-numbers text-center mt-4 pt-3 border-top">
                <Button variant="outline-primary" size="lg" className="w-100">
                  이 번호 저장하기
                </Button>
                <p className="text-muted mt-2 small">
                  <i className="bi bi-info-circle me-1"></i>
                  번호를 저장하려면 로그인이 필요합니다.
                </p>
              </div>

              {/* 인기 번호 표시 */}
              <div className="popular-numbers mt-4 pt-3 border-top">
                <p className="popular-numbers-title fw-bold text-primary mb-2">
                  <i className="bi bi-star-fill me-1"></i> 이번 주 인기 번호
                </p>
                <div className="popular-numbers-display">
                  {popularNumbers.map((number, index) => (
                    <span 
                      key={index} 
                      className={`lotto-ball lotto-ball-sm ${getBallColorClass(number)}`}
                    >
                      {number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Col>
          
          {/* 우측: 랜덤 생성 번호 */}
          <Col lg={6}>
            <div className="random-numbers-container bg-white p-4 shadow-sm rounded">
              <h3 className="selection-title mb-3">로또메이트 추천 번호</h3>
              <p className="selection-info mb-4">
                로또메이트가 자동으로 생성한 번호입니다. 마음에 들지 않으면 다시 뽑기를 눌러보세요.
              </p>
              
              <div className="random-numbers-display text-center mb-4">
                {randomNumbers.map((number, index) => (
                  <span 
                    key={index} 
                    className={`lotto-ball lotto-ball-lg ${getBallColorClass(number)}`}
                  >
                    {number}
                  </span>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="random-btn px-4 mt-4"
                  onClick={generateRandomNumbers}
                >
                  <Shuffle className="me-2" />
                  다시 뽑기
                </Button>
              </div>
              
              <div className="random-option mt-5 mb-3 pt-4">
                <Form>
                  <Form.Check 
                    type="checkbox" 
                    id="exclude-recent" 
                    label="최근 당첨번호 제외하기" 
                    className="mb-2"
                  />
                  <Form.Check 
                    type="checkbox" 
                    id="balanced-option" 
                    label="균형 있는 번호 조합으로 생성하기" 
                  />
                </Form>
              </div>
              
              <div className="save-numbers text-center mt-4 pt-3 border-top">
                <Button variant="outline-primary" size="lg" className="w-100">
                  이 번호 저장하기
                </Button>
                <p className="text-muted mt-2 small">
                  <i className="bi bi-info-circle me-1"></i>
                  번호를 저장하려면 로그인이 필요합니다.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NumberGeneratorSection;