import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import UseAxios from '../../hooks/UseAxios';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import '../../resources/css/login.css';
import logo from '../../resources/img/logo3.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UseAxios hook 가져오기
  const { req, loading } = UseAxios();
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 일반 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const { email, password } = formData;
    
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      // UseAxios hook을 사용하여 로그인 API 호출
      const response = await req('POST', 'auth/login', { email, password });
      
      if (response && response.data) {
        // 로그인 성공 처리
        const { accessToken, refreshToken } = response.data;
        
        // AuthContext를 통해 로그인 상태 업데이트
        login(email, accessToken, refreshToken);
        
        // 홈 페이지로 이동
        navigate('/');
      } else {
        setErrorMsg('로그인에 실패했습니다. 응답 데이터가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      
      // 서버에서 전달받은 오류 메시지가 있으면 사용, 없으면 기본 메시지 표시
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      setErrorMsg(errorMessage);
    }
  };
  
  // 백엔드 API 기본 URL (환경에 따라 다르게 설정)
  const BACKEND_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:8080'
      : 'https://lottomateapi.eeerrorcode.com';

  // 소셜 로그인 처리
  const handleSocialLogin = (provider) => {
    // 소셜 로그인 요청 URL 생성
    const socialLoginUrl = `${BACKEND_BASE_URL}/api/auth/oauth2/authorize/${provider}`;
    
    // 사용자를 소셜 로그인 페이지로 리다이렉트
    window.location.href = socialLoginUrl;
  };

  return (
    <div className="modern-login-container">
      <div className="modern-login-card">
        <div className="login-left-panel">
          <div className="login-brand">
            <Link to="/">
              <img src={logo} alt="로또메이트" className="login-logo" />
            </Link>
          </div>
          <div className="login-welcome-text">
            <h1>Welcome back!</h1>
            <p>로또메이트에 오신 것을 환영합니다.<br />기존 계정으로 로그인하세요.</p>
          </div>
          <div className="login-decoration">
            {/* 장식 요소들 */}
            <div className="login-shape login-shape-1"></div>
            <div className="login-shape login-shape-2"></div>
            <div className="login-shape login-shape-3"></div>
            <div className="login-shape login-shape-4"></div>
          </div>
        </div>
        
        <div className="login-right-panel">
          <div className="login-form-container">
            <h2 className="login-title">Sign In</h2>
            
            {errorMsg && (
              <div className="login-error-message">{errorMsg}</div>
            )}
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">Username or email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일 주소를 입력하세요" 
                  className="login-input"
                  required 
                />
              </div>
              
              <div className="login-form-group">
                <div className="login-password-header">
                  <label htmlFor="password" className="login-label">Password</label>
                  <Link to="/forgot-password" className="login-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="login-password-input">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요" 
                    className="login-input"
                    required 
                  />
                  <button 
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                </div>
              </div>
              
              <div className="login-remember-me">
                <label className="login-checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={() => setRememberMe(!rememberMe)} 
                    className="login-checkbox"
                  />
                  <span className="login-checkmark"></span>
                  <span className="login-checkbox-text">Remember me</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="login-submit-btn" 
                disabled={loading}
              >
                {loading ? '로그인 중...' : 'Sign In'}
              </button>
            </form>
            
            <div className="login-register-link">
              <span className="login-register-text">New here? </span>
              <Link to="/signup" className="login-register-action">Create an Account</Link>
            </div>
            
            <div className="login-divider">
              <span className="login-divider-text">or continue with</span>
            </div>
            
            <div className="login-social-buttons">
              <button 
                type="button" 
                className="login-social-btn login-google"
                onClick={() => handleSocialLogin('GOOGLE')}
              >
                <img src={`${process.env.PUBLIC_URL}/google-icon.svg`} alt="Google 로그인" className="social-icon" />
                <span className="social-btn-text">Google 계정으로 로그인</span>
              </button>
              
              <button 
                type="button" 
                className="login-social-btn login-kakao"
                onClick={() => handleSocialLogin('KAKAO')}
              >
                <img src={`${process.env.PUBLIC_URL}/kakao-icon.svg`} alt="Kakao 로그인" className="social-icon" />
                <span className="social-btn-text">카카오 계정으로 로그인</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;