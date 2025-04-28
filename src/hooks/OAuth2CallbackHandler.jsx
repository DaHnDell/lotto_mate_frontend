import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { Spinner } from 'react-bootstrap';

/**
 * OAuth2 콜백 처리 컴포넌트
 * 소셜 로그인 후 리다이렉트된 URL의 토큰 파라미터를 처리합니다.
 */
const OAuth2CallbackHandler = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    // URL에서 쿼리 파라미터 파싱
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    
    // 토큰이 있으면 로그인 처리
    if (token && refreshToken) {
      try {
        // JWT 토큰에서 이메일 정보 추출
        const payload = parseJwt(token);
        const email = payload.sub; // JWT의 subject 필드에 이메일이 있다고 가정
        
        // 로그인 처리 (세션 스토리지에 저장)
        login(email, token, refreshToken, false);
        
        setProcessing(false);
        
        // 홈페이지로 리다이렉트
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('토큰 처리 오류:', error);
        setError('인증 토큰을 처리하는 중 오류가 발생했습니다.');
        setProcessing(false);
      }
    } else {
      // 토큰이 없으면 오류 메시지 설정
      setError('인증 토큰을 찾을 수 없습니다.');
      setProcessing(false);
      
      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/login', { 
          replace: true,
          state: { error: 'auth_failed' }
        });
      }, 3000);
    }
  }, [location, login, navigate]);

  // JWT 토큰 디코딩 함수
  const parseJwt = (token) => {
    try {
      // JWT의 페이로드 부분 (두 번째 부분) 추출
      const base64Url = token.split('.')[1];
      // Base64 URL 디코딩
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // JSON 파싱
      return JSON.parse(window.atob(base64));
    } catch (e) {
      console.error('JWT 파싱 오류:', e);
      return {};
    }
  };

  return (
    <div className="oauth-callback-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f8fa'
    }}>
      <div className="oauth-callback-card" style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        {error ? (
          <div>
            <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>인증 오류</h3>
            <p>{error}</p>
            <p>로그인 페이지로 이동합니다...</p>
          </div>
        ) : (
          <div>
            <Spinner animation="border" variant="primary" />
            <h3 style={{ marginTop: '1rem' }}>로그인 처리 중</h3>
            <p>{processing ? '소셜 로그인 정보를 확인하는 중입니다...' : '로그인 성공! 메인 페이지로 이동합니다...'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuth2CallbackHandler;