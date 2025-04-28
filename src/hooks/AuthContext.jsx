import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API 기본 URL 설정
const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/'
    : 'https://lottomateapi.eeerrorcode.com/api/';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 상태 초기화
  const [email, setEmail] = useState(localStorage.getItem('email') || sessionStorage.getItem('email'));
  const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);

  // const navigate = useNavigate();
  // 로그아웃 처리 함수
  const handleLogout = useCallback(() => {
    // 로컬 상태 초기화
    setEmail(null);
    setToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);

    // localStorage와 sessionStorage에서 토큰 관련 정보 제거
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    
    // 이메일은 rememberMe 설정에 따라 유지할 수 있음
    if (localStorage.getItem('rememberMe') !== 'true') {
      localStorage.removeItem('email');
      sessionStorage.removeItem('email');
    }
  }, []);
  // 간단한 API 요청 함수 (UseAxios 대체)
  const authRequest = useCallback(async (method, endpoint, data = null) => {
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      return response.data;
    } catch (error) {
      console.error(`${method} ${endpoint} 요청 오류:`, error);
      throw error;
    }
  }, [token]); // 🔥 의존성 token 필요

  // 토큰 만료 시간 확인 (토큰 새로고침 결정)
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    
    try {
      // JWT 토큰 파싱
      const payload = JSON.parse(atob(token.split('.')[1]));
      // 만료 시간 확인 (exp는 초 단위)
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      console.error('토큰 검증 오류:', e);
      return true;
    }
  }, []);
  
  // 토큰 갱신 함수
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;
    
    try {
      const response = await authRequest('POST', 'auth/refresh-token', {
        refreshToken: refreshToken
      });
      
      if (response && response.data) {
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;
        
        // 스토리지 결정 (localStorage에 rememberMe가 있으면 localStorage, 없으면 sessionStorage)
        const storage = localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
        
        // 새 토큰 저장
        storage.setItem('token', newToken);
        storage.setItem('refreshToken', newRefreshToken);
        
        // 상태 업데이트
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      // 갱신 실패 시 로그아웃 처리 (logout 함수를 직접 호출하지 않고 로그아웃 로직 실행)
      handleLogout();
      return false;
    }
  }, [refreshToken, authRequest, handleLogout]);
  
  // 초기화 시 토큰 유효성 검사 및 자동 갱신
  useEffect(() => {
    const validateAuth = async () => {
      if (token && isTokenExpired(token)) {
        // 토큰이 만료된 경우, 리프레시 토큰으로 갱신 시도
        const refreshed = await refreshAccessToken();
        
        if (!refreshed) {
          // 갱신 실패 시 로그아웃 처리
          handleLogout();
        }
      }
      
      setIsLoading(false);
    };
    
    validateAuth();
  }, [token, isTokenExpired, refreshAccessToken, handleLogout]);

  // 로그인 처리
  const login = (userEmail, userToken, userRefreshToken, rememberMe = false) => {

    setEmail(userEmail);
    setToken(userToken);
    setRefreshToken(userRefreshToken);
    setIsLoggedIn(true);

    // 스토리지 선택 (rememberMe에 따라)
    const storage = localStorage
    
    // 토큰 저장
    storage.setItem('token', userToken);
    storage.setItem('refreshToken', userRefreshToken);
    storage.setItem('email', userEmail);
    
    // rememberMe 설정 저장 (localStorage에만)
    localStorage.setItem('rememberMe', rememberMe.toString());
  };

  // 로그아웃 처리 (서버에 요청 후 로컬 상태 정리)
  const logout = useCallback(async () => {
    try {
      // 서버에 로그아웃 요청 (refreshToken 무효화)
      if (refreshToken) {
        await authRequest('POST', 'auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      // 로컬 상태 정리
      handleLogout();
    }
  }, [refreshToken, authRequest, handleLogout]);

  return (
    <AuthContext.Provider value={{ 
      email, 
      token, 
      refreshToken, 
      isLoggedIn,
      isLoading,
      login, 
      logout,
      refreshAccessToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);