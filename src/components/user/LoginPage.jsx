import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../resources/css/login.css';
import logo from '../../resources/img/logo3.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 일반 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 로그인 성공 처리
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userEmail', email);
        
        // 메인 페이지로 이동
        window.location.href = '/';
      } else {
        alert(`로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };
  
  const BACKEND_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://lottomateapi.eeerrorcode.com';

  // 백엔드 기반 구글 로그인 처리
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_BASE_URL}/api/auth/oauth2/authorize/GOOGLE`;
  };

  // 백엔드 기반 카카오 로그인 처리
  const handleKakaoLogin = () => {
    window.location.href = `${BACKEND_BASE_URL}/api/auth/oauth2/authorize/KAKAO`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="로또메이트" className="app-logo" />
        </div>
        
        <h2 className="welcome-text">Welcome to Sneat! 👋</h2>
        <p className="subtitle">Please sign-in to your account and start the adventure</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>EMAIL OR USERNAME</label>
            <input 
              type="text" 
              name="email" 
              placeholder="Enter your email or username" 
              required 
            />
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label>PASSWORD</label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="············" 
                required 
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
              </button>
            </div>
          </div>
          
          <div className="remember-me">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={() => setRememberMe(!rememberMe)} 
              />
              <span className="checkmark"></span>
              Remember Me
            </label>
          </div>
          
          <button type="submit" className="sign-in-btn">Sign in</button>
        </form>
        
        <div className="new-account">
          <span>New on our platform? </span>
          <Link to="/signup" className="create-account-link">Create an account</Link>
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <div className="social-login">
          <button onClick={handleGoogleLogin} className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          
          <button onClick={handleGoogleLogin} className="social-btn google">
            <i className="fab fa-google"></i>
          </button>
          
          <button onClick={handleKakaoLogin} className="social-btn twitter">
            <i className="fab fa-twitter"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;