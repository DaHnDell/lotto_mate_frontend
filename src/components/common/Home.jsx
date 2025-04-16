import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HeroSlider from './sections/HeroSlider';
// import ServicesSection from './sections/ServicesSection';
// import PremiumSection from './sections/PremiumSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../resources/css/style.css';
import NumberGeneratorSection from './sections/NumberGeneratorSection';

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
      
      // location state 초기화 (히스토리에 남지 않도록)
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

  return (
    <div className="home-container">
      <Header />
      
      <main className="main-content">
        {/* 각 섹션에 id 속성 추가 */}
        <div id="hero-slider-section">
          <HeroSlider />
        </div>

        {/* 번호 뽑기 섹션 - 추가됨 */}
        <div id="number-generator-section">
          <NumberGeneratorSection />
        </div>

        {/*
        <div id="premium-section">
          <PremiumSection />
        </div> */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;