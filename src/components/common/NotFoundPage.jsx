import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import '../../resources/css/notFound.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <div className="error-code">404</div>
              
              <div className="error-icon">
                <ExclamationTriangle size={80} />
              </div>
              
              <h1 className="error-title">페이지를 찾을 수 없습니다</h1>
              
              <p className="error-description">
                찾으시려는 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용할 수 없습니다.
              </p>
              
              <div className="not-found-lotto-balls">
                <div className="not-found-lotto-ball not-found-lotto-ball-1">4</div>
                <div className="not-found-lotto-ball not-found-lotto-ball-2">0</div>
                <div className="not-found-lotto-ball not-found-lotto-ball-3">4</div>
                <div className="not-found-lotto-ball not-found-lotto-ball-4">!</div>
              </div>
              
              <p className="error-message">
                하지만 걱정하지 마세요! 행운의 번호는 아직 여기 있습니다.
              </p>
              
              <div className="action-buttons">
                <Button as={Link} to="/" variant="primary" size="lg" className="me-3">
                  홈으로 가기
                </Button>
                <Button as={Link} to="/number-generator" variant="outline-primary" size="lg">
                  번호 생성하기
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default NotFoundPage;