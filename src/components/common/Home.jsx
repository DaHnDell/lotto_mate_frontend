import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        {/* 여기에 홈페이지 본문 콘텐츠를 추가할 수 있습니다 */}
        <div className="home-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10 text-center">
                <h1 className="home-title">웹사이트에 오신 것을 환영합니다</h1>
                <p className="home-subtitle">
                  이곳은 홈페이지 콘텐츠가 들어갈 자리입니다. 
                  현재는 헤더와 푸터가 포함되어 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;