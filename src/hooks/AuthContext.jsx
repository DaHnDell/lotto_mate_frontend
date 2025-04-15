import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  // token, email
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [mno, setMno] = useState(localStorage.getItem('mno'));
  const navigate = useNavigate();

  useEffect(() => {
    // 초기화 시 localStorage의 값을 가져오기
    if(token && email && mno) {
      const storedMember = localStorage.getItem('email');
      setEmail(storedMember);
    }
  }, [token, email, mno]);

  const login = (email, token, mno) => {
    setEmail(email);
    setToken(token);
    setMno(mno);

    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('mno', mno);

    // 로그인 처리 후 리디렉션
    navigate('/');
  }

  const logout = () => {
    setEmail(null);
    setToken(null);
    setMno(null);

    localStorage.removeItem('token', token);
    localStorage.removeItem('email', email);
    localStorage.removeItem('mno', mno);

    // 로그아웃 처리 후 리디렉션
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{email, token, mno, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);