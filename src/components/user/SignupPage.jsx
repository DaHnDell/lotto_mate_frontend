import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UseAxios from '../../hooks/UseAxios';
import { Eye, EyeSlash, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import '../../resources/css/login.css';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });
  
  // UseAxios hook 가져오기 
  const { req, loading } = UseAxios();
  
  // 비밀번호 검증 상태
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false,
    isMatching: false
  });
  
  // 비밀번호 입력 타이머
  const [passwordTimer, setPasswordTimer] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
  const navigate = useNavigate();

  // 입력 변경 핸들러 수정
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // 먼저 새로운 formData 객체 생성 (이걸 검증에서 사용)
    const updatedFormData = {
      ...formData,
      [name]: newValue
    };
    
    // 상태 업데이트
    setFormData(updatedFormData);
    
    // 비밀번호 필드 처리
    if (name === 'password') {
      // 타이머 초기화
      if (passwordTimer) {
        clearTimeout(passwordTimer);
      }
      
      // 입력이 있으면 1초 후에 검증 실행
      if (value.length > 0) {
        const timer = setTimeout(() => {
          validatePasswordWithFeedback(value, updatedFormData.confirmPassword);
        }, 1000);
        
        setPasswordTimer(timer);
      } else {
        // 입력이 없으면 에러 메시지 초기화
        setPasswordErrorMsg('');
        setShowPasswordRequirements(false);
      }
    }
    
    // 비밀번호 확인 필드 처리 - 항상 검증을 수행하도록 수정
    if (name === 'confirmPassword') {
      validatePassword(updatedFormData.password, value);
    }
  };
  
  // 비밀번호 유효성 검사 (각 요구사항만 확인)
  const validatePassword = (password, confirmPassword) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      isMatching: password === confirmPassword && password !== ''
    });
  };
  
  // 비밀번호 유효성 검사 (순차적 피드백 제공)
  const validatePasswordWithFeedback = (password, confirmPassword) => {
    // 기본 검증 상태 업데이트
    const newValidation = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      isMatching: password === confirmPassword && password !== ''
    };
    
    setPasswordValidation(newValidation);
    setShowPasswordRequirements(true);
    
    // 순차적 오류 메시지 표시
    if (!newValidation.minLength) {
      setPasswordErrorMsg('비밀번호는 8자 이상으로 만들어주세요.');
      return;
    }
    
    if (!newValidation.hasNumber) {
      setPasswordErrorMsg('비밀번호에 숫자를 포함시켜주세요.');
      return;
    }
    
    if (!newValidation.hasSpecial) {
      setPasswordErrorMsg('비밀번호에 특수문자를 포함시켜주세요.');
      return;
    }
    
    if (!newValidation.hasUpper) {
      setPasswordErrorMsg('비밀번호에 대문자를 포함시켜주세요.');
      return;
    }
    
    // 모든 조건 충족 시 에러 메시지 제거
    setPasswordErrorMsg('');
  };
  
  // 회원가입 처리
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    const { email, name, password, confirmPassword, termsAgreed } = formData;
    
    // 필수 입력 확인
    if (!email || !name || !password) {
      setErrorMsg('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    // 비밀번호 확인
    if (password !== confirmPassword) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 약관 동의 확인
    if (!termsAgreed) {
      setErrorMsg('서비스 이용약관에 동의해주세요.');
      return;
    }
    
    // 비밀번호 유효성 검사
    const isPasswordValid = Object.values(passwordValidation).every(value => value);
    if (!isPasswordValid) {
      setErrorMsg('비밀번호 요구사항을 모두 충족해주세요.');
      return;
    }
    
    try {
      // UseAxios hook을 사용하여 회원가입 API 호출
      const response = await req('POST', 'auth/signup', { email, name, password });
      console.log("회원가입 응답:", response);
      // CommonResponse 형식에 맞게 응답 처리
      if (response && response.message && !response.error) {
        setSuccessMsg('회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.');
        
        // 알림창 표시
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      
      // 서버에서 전달받은 오류 메시지 확인
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // CommonResponse 형식의 오류 메시지 처리
        if (errorData.message) {
          setErrorMsg(errorData.message);
        } else if (errorData.code === 'REGISTRATION_ERROR') {
          setErrorMsg(errorData.message || '이미 등록된 이메일입니다.');
        } else {
          setErrorMsg('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setErrorMsg('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };
  
  // 이메일 중복 확인 함수
  const checkEmailDuplication = async (email) => {
    if (!email || !isValidEmail(email)) return;
    
    try {
      const response = await req('GET', `user/check-email?email=${encodeURIComponent(email)}`);
      
      // CommonResponse 형식에 맞게 응답 처리
      if (response && response.code === 'success' && response.data) {
        if (response.data.duplicated) {
          setErrorMsg('이미 등록된 이메일입니다.');
          return true; // 중복됨
        }
        return false; // 중복되지 않음
      }
      return false;
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      return false;
    }
  };

  // 이메일 형식 검사 함수
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 필드에 blur 이벤트 핸들러 추가
  const handleEmailBlur = async () => {
    const isDuplicated = await checkEmailDuplication(formData.email);
    if (isDuplicated) {
      // 중복된 경우 처리 (이미 에러 메시지는 설정됨)
    } else if (formData.email && !isValidEmail(formData.email)) {
      setErrorMsg('올바른 이메일 형식이 아닙니다.');
    } else {
      setErrorMsg(''); // 에러 메시지 초기화
    }
  };

  // 비밀번호 강도 표시
  const renderPasswordStrength = () => {
    const { minLength, hasNumber, hasSpecial, hasUpper } = passwordValidation;
    const validCount = [minLength, hasNumber, hasSpecial, hasUpper].filter(Boolean).length;
    
    let strengthClass = 'password-strength-weak';
    let strengthText = '약함';
    
    if (validCount === 4) {
      strengthClass = 'password-strength-strong';
      strengthText = '강함';
    } else if (validCount >= 2) {
      strengthClass = 'password-strength-medium';
      strengthText = '보통';
    }
    
    return (
      <div className="password-strength">
        <div className={`password-strength-bar ${strengthClass}`}>
          <div className="password-strength-fill" style={{ width: `${(validCount / 4) * 100}%` }}></div>
        </div>
        <span className={`password-strength-text ${strengthClass}`}>{strengthText}</span>
      </div>
    );
  };

  return (
    <div className="modern-login-container">
      <div className="modern-login-card">
        <div className="login-left-panel">
          <div className="login-brand">
            <Link to="/">
              <img src={`${process.env.PUBLIC_URL}/logo3.png`} alt="로또메이트" className="login-logo" />
            </Link>
          </div>
          <div className="login-welcome-text">
            <h1>Join us today!</h1>
            <p>로또메이트의 모든 서비스를<br />이용하기 위해 회원가입을 해주세요.</p>
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
            <h2 className="login-title">Sign Up</h2>
            
            {successMsg && (
              <div className="login-success-message">{successMsg}</div>
            )}
            
            <form onSubmit={handleSignup} className="login-form">
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">Email address *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder="example@email.com" 
                  className="login-input"
                  required 
                />
                {errorMsg && (
                  <div className="login-error-message">{errorMsg}</div>
                )}
              </div>
              
              <div className="login-form-group">
                <label htmlFor="name" className="login-label">Full name *</label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요" 
                  className="login-input"
                  required 
                />
              </div>
              
              <div className="login-form-group">
                <label htmlFor="password" className="login-label">Password *</label>
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
                
                {formData.password && renderPasswordStrength()}
                
                {passwordErrorMsg && (
                  <div className="password-error-message">
                    {passwordErrorMsg}
                  </div>
                )}
                
                {showPasswordRequirements && (
                  <div className="password-requirements">
                    <div className="password-requirement">
                      {passwordValidation.minLength 
                        ? <CheckCircleFill className="requirement-icon valid" /> 
                        : <XCircleFill className="requirement-icon invalid" />}
                      <span>8자 이상</span>
                    </div>
                    <div className="password-requirement">
                      {passwordValidation.hasNumber 
                        ? <CheckCircleFill className="requirement-icon valid" /> 
                        : <XCircleFill className="requirement-icon invalid" />}
                      <span>숫자 포함</span>
                    </div>
                    <div className="password-requirement">
                      {passwordValidation.hasSpecial 
                        ? <CheckCircleFill className="requirement-icon valid" /> 
                        : <XCircleFill className="requirement-icon invalid" />}
                      <span>특수문자 포함</span>
                    </div>
                    <div className="password-requirement">
                      {passwordValidation.hasUpper 
                        ? <CheckCircleFill className="requirement-icon valid" /> 
                        : <XCircleFill className="requirement-icon invalid" />}
                      <span>대문자 포함</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="login-form-group">
                <label htmlFor="confirmPassword" className="login-label">Confirm Password *</label>
                <div className="login-password-input">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword"
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력하세요" 
                    className="login-input"
                    required 
                  />
                  <button 
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    {showConfirmPassword ? <EyeSlash /> : <Eye />}
                  </button>
                </div>
                
                {formData.confirmPassword && (
                  <div className="password-match">
                    {passwordValidation.isMatching 
                      ? <CheckCircleFill className="match-icon valid" /> 
                      : <XCircleFill className="match-icon invalid" />}
                    <span>{passwordValidation.isMatching ? '비밀번호 일치' : '비밀번호 불일치'}</span>
                  </div>
                )}
              </div>
              
              <div className="login-form-group">
                <label className="login-checkbox-container">
                  <input 
                    type="checkbox" 
                    name="termsAgreed"
                    checked={formData.termsAgreed} 
                    onChange={handleChange} 
                    className="login-checkbox"
                    required
                  />
                  <span className="login-checkmark"></span>
                  <span className="login-checkbox-text">
                    <Link to="/terms" className="terms-link">서비스 이용약관</Link>과 
                    <Link to="/privacy" className="terms-link"> 개인정보 처리방침</Link>에 동의합니다
                  </span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="login-submit-btn" 
                disabled={loading || successMsg}
              >
                {loading ? '회원가입 중...' : '회원가입'}
              </button>
            </form>
            
            <div className="login-register-link">
              <span className="login-register-text">Already have an account? </span>
              <Link to="/login" className="login-register-action">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;