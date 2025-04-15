import React from 'react';
import Header from './Header';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        {/* 여기에 홈페이지 본문 콘텐츠를 추가할 수 있습니다 */}
        <div className="hero-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10 text-center">
                <h1 className="hero-title">웹사이트에 오신 것을 환영합니다</h1>
                <p className="hero-subtitle">
                  이곳은 홈페이지 콘텐츠가 들어갈 자리입니다. 
                  현재는 헤더만 포함되어 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;