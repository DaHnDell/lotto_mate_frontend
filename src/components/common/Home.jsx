import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HeroSlider from './sections/HeroSlider';
import NumberGeneratorSection from './sections/NumberGeneratorSection';
import NoticeAndFaqSection from './sections/NoticeAndFaqSection'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../resources/css/style.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 페이지 로드시 URL 해시가 있으면 해당 섹션으로 스크롤
  useEffect(() => {
    // location.state에서 스크롤할 섹션 ID가 있는지 확인
    if (location.state && location.state.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      const section = document.getElementById(sectionId);
      
      if (section) {
        // 헤더 높이를 고려한 스크롤 위치 계산
        const headerHeight = document.querySelector('.custom-navbar').offsetHeight;
        
        setTimeout(() => {
          window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
      
      // location state 초기화
      navigate('/', { replace: true });
    } 
    // URL 해시를 확인하여 해당 섹션으로 스크롤
    else if (location.hash) {
      const sectionId = location.hash.substring(1); // '#' 제거
      const section = document.getElementById(sectionId);
      
      if (section) {
        // 헤더 높이를 고려한 스크롤 위치 계산
        const headerHeight = document.querySelector('.custom-navbar').offsetHeight;
        
        setTimeout(() => {
          window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if(!window.__LOGO_PRINTED__){
      console.log(`
      ██████╗  ██████╗ ███╗   ███╗ █████╗ ███╗   ██╗████████╗██╗ ██████╗  ██████╗ ██████╗ ██████╗ ███████╗
      ██╔══██╗██╔═══██╗████╗ ████║██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝ ██╔════╝██╔═══██╗██╔══██╗██╔════╝
      ██████╔╝██║   ██║██╔████╔██║███████║██╔██╗ ██║   ██║   ██║██║      ██║     ██║   ██║██║  ██║█████╗  
      ██╔══██╗██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║   ██║   ██║██║      ██║     ██║   ██║██║  ██║██╔══╝  
      ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║   ██║   ██║╚██████╗ ╚██████╗╚██████╔╝██████╔╝███████╗
      ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
                                          코딩은 낭만이다 - 낭만코딩단                                    
      `);
      window.__LOGO_PRINTED__ = true;
    }
  }, []);

  return (
    <div className="home-container">
      <Header />
      
      <main className="main-content">
        {/* 각 섹션에 id 속성 추가 */}
        <div id="hero-slider-section">
          <HeroSlider />
        </div>

        {/* 번호 뽑기 섹션 */}
        <div id="number-generator-section">
          <NumberGeneratorSection />
        </div>

        {/* 공지사항 및 FAQ 섹션 */}
        <div id="notice-faq-section">
          <NoticeAndFaqSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;