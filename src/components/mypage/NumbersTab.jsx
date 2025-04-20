import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NumbersTab = ({ userNumbers, formatDate }) => {
  const navigate = useNavigate();
  
  return (
    <div className="numbers-section">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">저장된 로또 번호</h4>
          <div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/number-generator')}
            >
              새 번호 생성
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {userNumbers.length > 0 ? (
            <div className="saved-numbers">
              {userNumbers.map((numberSet, index) => (
                <div key={index} className="saved-number-item mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">
                      {numberSet.name || `번호 세트 ${index + 1}`}
                      <span className="badge bg-secondary ms-2">{numberSet.drawRound}회차</span>
                    </h5>
                    <div className="saved-number-actions">
                      <Button variant="outline-danger" size="sm">삭제</Button>
                    </div>
                  </div>
                  
                  <div className="lotto-number-container">
                    {numberSet.numbers.split(',').map((num, idx) => {
                      const number = parseInt(num);
                      return (
                        <span 
                          key={idx} 
                          className={`lotto-ball lotto-ball-${Math.ceil(number / 10)}`}
                        >
                          {number}
                        </span>
                      );
                    })}
                  </div>
                  
                  <div className="number-details mt-2">
                    <small className="text-muted">
                      {numberSet.isAuto ? '자동 생성' : '수동 선택'} | 
                      저장일: {formatDate(numberSet.createdAt)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-saved-numbers text-center py-4">
              <h5 className="mb-3">저장된 로또 번호가 없습니다</h5>
              <p className="mb-4">번호 생성기를 통해 나만의 번호를 만들고 저장해보세요.</p>
              <Button 
                variant="primary"
                onClick={() => navigate('/number-generator')}
              >
                번호 생성하기
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NumbersTab;