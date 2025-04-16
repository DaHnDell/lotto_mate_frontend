import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../resources/css/style.css';
import logo from '../../resources/img/logo3.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-slider-section');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  // 스크롤 감지 및 현재 활성 섹션 업데이트
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 감지로 헤더 스타일 변경
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 홈페이지일 때만 현재 보이는 섹션 감지
      if (isHomePage) {
        const sections = document.querySelectorAll('div[id]');
        const scrollPosition = window.pageYOffset + 200; // 헤더 높이 + 여유값 만큼 오프셋 추가
        
        // 현재 스크롤 위치에 포함된 섹션 확인
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          
          // 스크롤 위치가 섹션 내에 있는지 확인
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sectionId);
          }
        });
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // 다른 페이지에서 홈 페이지의 특정 섹션으로 이동하는 함수
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    
    if (!isHomePage) {
      // 상세 페이지에서는 홈으로 이동한 후 해당 섹션으로 스크롤
      navigate('/', { state: { scrollToSection: sectionId } });
    } else {
      // 홈 페이지에서는 해당 섹션으로 스크롤
      const section = document.getElementById(sectionId);
      if (section) {
        const headerHeight = document.querySelector('.custom-navbar').offsetHeight;
        window.scrollTo({
          top: section.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    }
  };
  
  // 홈 페이지 진입 시 스크롤 처리
  useEffect(() => {
    if (isHomePage && location.state && location.state.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      const section = document.getElementById(sectionId);
      
      if (section) {
        // 약간의 딜레이 후 스크롤 (페이지 로딩 완료 후 스크롤하기 위함)
        setTimeout(() => {
          const headerHeight = document.querySelector('.custom-navbar').offsetHeight;
          window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
      
      // state 초기화 (히스토리에 남지 않도록)
      navigate('/', { replace: true });
    }
  }, [isHomePage, location.state, navigate]);

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
          <Nav.Link 
             href="#hero-slider-section" 
             className={activeSection === 'hero-slider-section' ? 'active' : ''}
             onClick={(e) => handleNavLinkClick(e, 'hero-slider-section')}
          >
            당첨 소식
          </Nav.Link>
          <Nav.Link 
            href="#number-generator-section" 
            className={activeSection === 'number-generator-section' ? 'active' : ''}
            onClick={(e) => handleNavLinkClick(e, 'number-generator-section')}
          >
            번호 뽑기
          </Nav.Link>
        </Nav>
        
        {/* 로고 (중앙) */}
        <Navbar.Brand 
          href="/" 
          className="mx-auto logo-brand"
          onClick={(e) => {
            e.preventDefault();
            if (isHomePage) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}
        >
          <img src={logo} alt="로고" className="logo-img" />
        </Navbar.Brand>
        
        {/* 오른쪽 메뉴 */}
        <Nav className="right-menu ms-auto fw-bold">
          <Nav.Link 
            href="#premium-section" 
            className={activeSection === 'premium-section' ? 'active' : ''}
            onClick={(e) => handleNavLinkClick(e, 'premium-section')}
          >
            로또메이트+
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/mypage"
          >
            마이페이지
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;