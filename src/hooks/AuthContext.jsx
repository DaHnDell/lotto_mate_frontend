// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//   // token, email
//   const [email, setEmail] = useState(localStorage.getItem('email'));
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [mno, setMno] = useState(localStorage.getItem('mno'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 초기화 시 localStorage의 값을 가져오기
//     if(token && email && mno) {
//       const storedMember = localStorage.getItem('email');
//       setEmail(storedMember);
//     }
//   }, [token, email, mno]);

//   const login = (email, token, mno) => {
//     setEmail(email);
//     setToken(token);
//     setMno(mno);

//     localStorage.setItem('token', token);
//     localStorage.setItem('email', email);
//     localStorage.setItem('mno', mno);

//     // 로그인 처리 후 리디렉션
//     navigate('/');
//   }

//   const logout = () => {
//     setEmail(null);
//     setToken(null);
//     setMno(null);

//     localStorage.removeItem('token', token);
//     localStorage.removeItem('email', email);
//     localStorage.removeItem('mno', mno);

//     // 로그아웃 처리 후 리디렉션
//     navigate('/');
//   }

//   return (
//     <AuthContext.Provider value={{email, token, mno, login, logout}}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 상태 초기화
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const navigate = useNavigate();

  // 로그인 여부 확인
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // 초기화 시 localStorage의 값을 가져오기
  useEffect(() => {
    if (token && email) {
      setIsLoggedIn(true);
    }
  }, [token, email]);

  // 로그인 처리
  const login = (userEmail, userToken, userRefreshToken) => {
    setEmail(userEmail);
    setToken(userToken);
    setRefreshToken(userRefreshToken);
    setIsLoggedIn(true);

    // localStorage에 저장
    localStorage.setItem('token', userToken);
    localStorage.setItem('refreshToken', userRefreshToken);
    localStorage.setItem('email', userEmail);
  };

  // 로그아웃 처리
  const logout = () => {
    setEmail(null);
    setToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);

    // localStorage에서 제거
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');

    // 홈으로 리다이렉트
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      email, 
      token, 
      refreshToken, 
      isLoggedIn, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);