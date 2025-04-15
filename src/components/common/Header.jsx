import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../resources/css/style.css';
import logo from '../../resources/img/logo3.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      variant="dark" 
      fixed="top" 
      className={`custom-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
    >
      <Container>
        {/* 왼쪽 메뉴 */}
        <Nav className="left-menu me-auto">
          <Nav.Link as={Link} to="/about">번호 뽑기</Nav.Link>
          <Nav.Link as={Link} to="/services">당첨 소식</Nav.Link>
        </Nav>
        
        {/* 로고 (중앙) */}
        <Navbar.Brand as={Link} to="/" className="mx-auto logo-brand">
          <img src={logo} alt="로고" className="logo-img" />
        </Navbar.Brand>
        
        {/* 오른쪽 메뉴 */}
        <Nav className="right-menu ms-auto fw-bold">
          <Nav.Link as={Link} to="/projects">로또메이트+</Nav.Link>
          <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
        </Nav>
        
        {/* 모바일 메뉴를 위한 토글 버튼 */}
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" className="mobile-toggle" /> */}
        
        {/* 모바일 메뉴 (기본적으로 숨겨져 있음) */}
        {/* <Navbar.Collapse id="basic-navbar-nav" className="mobile-menu">
          <Nav className="mobile-nav">
            <Nav.Link as={Link} to="/about">번호 뽑기</Nav.Link>
            <Nav.Link as={Link} to="/services">당첨 소식</Nav.Link>
            <Nav.Link as={Link} to="/projects">로또메이트+</Nav.Link>
            <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
          </Nav>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
};

export default Header;