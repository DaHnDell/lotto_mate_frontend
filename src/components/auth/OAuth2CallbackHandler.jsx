import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

/**
 * OAuth2 콜백 처리 컴포넌트
 * 소셜 로그인 후 리다이렉트된 URL의 토큰 파라미터를 처리합니다.
 */
const OAuth2CallbackHandler = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 쿼리 파라미터 파싱
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    
    // 토큰이 있으면 로그인 처리
    if (token && refreshToken) {
      // 토큰에서 페이로드 추출해 이메일 가져오기
      const payload = token.split('.')[1];
      let email = '';
      
      try {
        // Base64 디코딩
        const decodedPayload = atob(payload);
        const tokenData = JSON.parse(decodedPayload);
        email = tokenData.sub; // JWT의 subject 필드에 이메일이 있다고 가정
      } catch (error) {
        console.error('토큰 파싱 오류:', error);
      }
      
      // 로그인 처리
      login(email, token, refreshToken);
      
      // 홈페이지로 리다이렉트
      navigate('/', { replace: true });
    } else {
      // 토큰이 없으면 로그인 페이지로
      console.error('인증 토큰을 찾을 수 없습니다.');
      navigate('/login', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <div className="auth-callback-container">
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로그인 처리 중...</span>
        </div>
        <p className="mt-3">로그인 정보를 확인하는 중입니다...</p>
      </div>
    </div>
  );
};

export default OAuth2CallbackHandler;