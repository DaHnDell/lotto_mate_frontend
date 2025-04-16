import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../resources/css/style.css';
import logo from '../../resources/img/logo3.png';
// Bootstrap 아이콘 추가
import { Envelope, Github, Telephone, Apple, Android } from 'react-bootstrap-icons';

const Footer = () => {
  // // 예시 당첨 번호 (실제로는 API에서 가져올 수 있음)
  // const [latestLotto, setLatestLotto] = useState({
  //   round: 1064,
  //   numbers: [8, 13, 19, 27, 40, 45],
  //   bonusNumber: 12,
  //   date: '2025-04-13'
  // });

  const latestLotto = {
    round: 1064,
    numbers: [8, 13, 19, 27, 40, 45],
    bonusNumber: 12,
    date: '2025-04-13'
  };

  return (
    <footer className="custom-footer py-5">
      <Container>
        {/* 최근 당첨 번호 섹션 */}
        <Row className="latest-lotto-section mb-4 py-3">
          <Col md={4} className="d-flex align-items-center">
            <h5 className="latest-lotto-title mb-0">최근 당첨번호</h5>
            <span className="latest-lotto-round ms-2">{latestLotto.round}회</span>
            <span className="latest-lotto-date ms-auto">({latestLotto.date})</span>
          </Col>
          <Col md={8} className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
            <div className="lotto-number-container">
              {latestLotto.numbers.map((num, index) => (
                <span key={index} className={`lotto-ball lotto-ball-${Math.ceil(num / 10)}`}>
                  {num}
                </span>
              ))}
              <span className="lotto-plus">+</span>
              <span className="lotto-ball lotto-ball-bonus">
                {latestLotto.bonusNumber}
              </span>
            </div>
            <Link to="/draw-results" className="more-link ms-3">
              더보기
            </Link>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <div className="footer-brand mb-3">
              <img src={logo} alt="로또메이트 로고" className="footer-logo-img" />
            </div>
            <p className="footer-desc">
              로또메이트는 로또 번호 생성, 당첨 정보 확인, 로또 통계 분석 등의 
              서비스를 제공하는 로또 애호가들을 위한 플랫폼입니다.
            </p>
            
            {/* 앱 다운로드 링크 섹션 */}
            <div className="app-download mt-4">
              <h5 className="footer-heading">앱 다운로드</h5>
              <div className="d-flex gap-2 mt-2">
                <Button variant="outline-light" size="sm" className="app-download-btn" as="a" href="https://apps.apple.com/search?term=lotto" target="_blank" rel="noopener noreferrer">
                  <Apple size={18} className="me-1" /> App Store
                </Button>
                <Button variant="outline-light" size="sm" className="app-download-btn" as="a" href="https://play.google.com/store/search?q=lotto" target="_blank" rel="noopener noreferrer">
                  <Android size={18} className="me-1" /> Play Store
                </Button>
              </div>
            </div>
          </Col>
          
          <Col lg={3} md={6} className="ps-5 mb-4 mb-lg-0">
            <h5 className="footer-heading">서비스</h5>
            <ul className="footer-links">
              <li><Link to="/number-generator">번호 뽑기</Link></li>
              <li><Link to="/draw-results">당첨 소식</Link></li>
              <li><Link to="/statistics">로또 통계</Link></li>
              <li><Link to="/premium">로또메이트+</Link></li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-heading">회원</h5>
            <ul className="footer-links">
              <li><Link to="/login">로그인</Link></li>
              <li><Link to="/register">회원가입</Link></li>
              <li><Link to="/mypage">마이페이지</Link></li>
              <li><Link to="/subscription">구독 정보</Link></li>
            </ul>
          </Col>
          
          <Col lg={4} md={6}>
            <h5 className="footer-heading">고객지원</h5>
            <ul className="footer-links">
              <li><Link to="/faq">자주 묻는 질문</Link></li>
              <li><Link to="/terms">이용약관</Link></li>
              <li><Link to="/privacy">개인정보처리방침</Link></li>
              <li><Link to="/contact">고객센터</Link></li>
            </ul>
            <div className="social-links mt-3">
              <a href="mailto:sophia76256@gmail.com" className="social-icon me-4" aria-label="이메일 보내기">
                <Envelope size={20} />
              </a>
              <a href="https://github.com/DaHnDell/lotto_mate_frontend" target="_blank" rel="noopener noreferrer" className="social-icon me-4" aria-label="깃허브 방문하기">
                <Github size={20} />
              </a>
              <a href="tel:+82-10-5191-9852" className="social-icon" aria-label="전화 걸기">
                <Telephone size={20} />
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="footer-bottom">
          <Col md={6} className="copyright">
            <p>&copy; {new Date().getFullYear()} 로또메이트. All rights reserved.</p>
          </Col>
          <Col md={6} className="footer-company-info text-md-end">
            <p>낭만 코딩단 | 사업자등록번호: 123-45-67890 | 대표: 이승환</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;