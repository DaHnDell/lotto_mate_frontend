import { createContext, useContext, useEffect, useState } from 'react';
import UseAxios from '../hooks/UseAxios';

// PaymentService Context 생성
const PaymentServiceContext = createContext(null);

// PaymentService 클래스
class PaymentServiceClass {
  constructor() {
    if (PaymentServiceClass.instance) {
      return PaymentServiceClass.instance;
    }
    
    this.axiosInstance = null;
    this.initialized = false;
    this.initializationPromise = null;
    this.listeners = new Set();
    
    PaymentServiceClass.instance = this;
  }
  
  // 토큰 가져오기 헬퍼 메서드
  getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  
  // 인증 헤더 생성
  getAuthHeaders(additionalHeaders = {}) {
    const token = this.getAuthToken();
    
    if (!token) {
      console.warn('인증 토큰이 없습니다. 로그인이 필요할 수 있습니다.');
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...additionalHeaders
    };
  }
  
  // 로그인 상태 확인
  isLoggedIn() {
    return !!this.getAuthToken();
  }
  
  // 비동기 초기화 (Promise 기반)
  async initialize(axiosInstance) {
    if (this.initialized) {
      return Promise.resolve();
    }
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = new Promise((resolve) => {
      this.axiosInstance = axiosInstance;
      this.initialized = true;
      
      // 모든 리스너에게 초기화 완료 알림
      this.listeners.forEach(listener => listener());
      this.listeners.clear();
      
      resolve();
    });
    
    return this.initializationPromise;
  }
  
  // 초기화 대기 메서드
  waitForInitialization() {
    if (this.initialized) {
      return Promise.resolve();
    }
    
    return new Promise((resolve) => {
      this.listeners.add(resolve);
    });
  }
  
  // 안전한 메서드 실행 래퍼
  async safeExecute(methodName, method) {
    try {
      await this.waitForInitialization();
      
      // 로그인 필요한 메서드인지 확인
      const requiresAuth = ![
        'getSubscriptionPlans', 
        'getSubscriptionPlanByName'
      ].includes(methodName);
      
      if (requiresAuth && !this.isLoggedIn()) {
        throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      }
      
      return await method();
    } catch (error) {
      console.error(`PaymentService.${methodName} 실행 오류:`, error);
      
      // 인증 관련 에러 처리
      if (error.response?.status === 401 || error.response?.status === 403) {
        // 토큰 만료 또는 인증 실패 시 로그아웃 처리
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      // 400 에러의 경우 서버 메시지 그대로 전달
      if (error.response?.status === 400 && error.response?.data) {
        throw new Error(error.response.data);
      }
      
      throw error;
    }
  }
  
  /**
   * 결제 검증 및 구독 정보 저장
   */
  async verifyPaymentAndCreateSubscription(paymentData, subscriptionInfo) {
    const email = localStorage.getItem('email');

    if (!email) {
      throw new Error('사용자 이메일 정보가 없습니다. 다시 로그인해주세요.');
    }

    return this.safeExecute('verifyPaymentAndCreateSubscription', async () => {
      const body = {
        impUid: paymentData.impUid,
        merchantUid: paymentData.merchantUid,
        plan: subscriptionInfo.plan,
        period: subscriptionInfo.period,
        amount: subscriptionInfo.amount,
        userEmail: email
      };
      
      const headers = this.getAuthHeaders();
      console.log('결제 검증 요청:', { body, headers }); // 디버깅용
      
      const result = await this.axiosInstance.req('POST', 'subscription/verify-payment', body, headers);
      console.log('결제 검증 API 응답:', result);
      return result;
    });
  }
  
  /**
   * 구독 정보 조회
   */
  async getSubscriptionInfo() {
    return this.safeExecute('getSubscriptionInfo', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', 'subscription/info', null, headers);
    });
  }
  
  /**
   * 결제 완료 후 구독 정보 상세 조회
   */
  async getSubscriptionDetails(imp_uid) {
    return this.safeExecute('getSubscriptionDetails', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', `subscription/details?imp_uid=${imp_uid}`, null, headers);
    });
  }
  
  /**
   * 구독 취소
   */
  async cancelSubscription(subscriptionId, reason) {
    return this.safeExecute('cancelSubscription', async () => {
      const body = {
        subscription_id: subscriptionId,
        reason: reason
      };
      
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('POST', 'subscription/cancel', body, headers);
    });
  }
  
  /**
   * 결제 영수증 조회
   */
  async getPaymentReceipt(imp_uid) {
    return this.safeExecute('getPaymentReceipt', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', `payment/receipt?imp_uid=${imp_uid}`, null, headers);
    });
  }

  /**
   * 결제 수단 등록
   */
  async registerPaymentMethod(paymentMethodData) {
    return this.safeExecute('registerPaymentMethod', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('POST', 'payment/methods', paymentMethodData, headers);
    });
  }

  /**
   * 결제 수단 목록 조회
   */
  async getPaymentMethods() {
    return this.safeExecute('getPaymentMethods', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', 'payment/methods', null, headers);
    });
  }

  /**
   * 결제 수단 삭제
   */
  async deletePaymentMethod(paymentMethodId) {
    return this.safeExecute('deletePaymentMethod', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('DELETE', `payment/methods/${paymentMethodId}`, null, headers);
    });
  }

  /**
   * 자동 갱신 설정 변경
   */
  async updateAutoRenewal(subscriptionId, autoRenewal) {
    return this.safeExecute('updateAutoRenewal', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('PUT', `subscription/${subscriptionId}/auto-renewal?autoRenewal=${autoRenewal}`, null, headers);
    });
  }

  /**
   * 플랜 변경
   */
  async changePlan(subscriptionId, planName) {
    return this.safeExecute('changePlan', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('PUT', `subscription/${subscriptionId}/plan?planName=${planName}`, null, headers);
    });
  }

  /**
   * 결제 수단 변경
   */
  async changePaymentMethod(subscriptionId, paymentMethodId) {
    return this.safeExecute('changePaymentMethod', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('PUT', `subscription/${subscriptionId}/payment-method?paymentMethodId=${paymentMethodId}`, null, headers);
    });
  }

  /**
   * 구독 생성
   */
  async createSubscription(subscriptionData) {
    return this.safeExecute('createSubscription', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('POST', 'subscription', subscriptionData, headers);
    });
  }

  /**
   * 구독 취소 이력 생성
   */
  async createCancellation(cancellationData) {
    return this.safeExecute('createCancellation', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('POST', 'subscription/cancellation', cancellationData, headers);
    });
  }

  /**
   * 구독 취소 이력 목록 조회
   */
  async getCancellationHistory() {
    return this.safeExecute('getCancellationHistory', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', 'subscription/cancellation', null, headers);
    });
  }

  /**
   * 구독 취소 이력 상세 조회
   */
  async getCancellationDetail(cancellationId) {
    return this.safeExecute('getCancellationDetail', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', `subscription/cancellation/${cancellationId}`, null, headers);
    });
  }

  /**
   * 결제 정보 조회
   */
  async getPaymentInfo(paymentId) {
    return this.safeExecute('getPaymentInfo', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', `payment/${paymentId}`, null, headers);
    });
  }

  /**
   * 결제 로그 기록
   */
  async logPaymentAction(logData) {
    return this.safeExecute('logPaymentAction', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('POST', 'payment/logs', logData, headers);
    });
  }

  /**
   * 결제 로그 조회
   */
  async getPaymentLogs() {
    return this.safeExecute('getPaymentLogs', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('GET', 'payment/logs', null, headers);
    });
  }

  /**
   * 환불 요청
   */
  async refundPayment(refundData) {
    return this.safeExecute('refundPayment', async () => {
      const headers = this.getAuthHeaders();
      return await this.axiosInstance.req('POST', 'payment/refund', refundData, headers);
    });
  }

  /**
   * 구독 플랜 목록 조회 (인증 불필요)
   */
  async getSubscriptionPlans() {
    return this.safeExecute('getSubscriptionPlans', async () => {
      return await this.axiosInstance.req('GET', 'subscription/plans/active');
    });
  }

  /**
   * 구독 플랜 상세 조회 (인증 불필요)
   */
  async getSubscriptionPlanByName(planName) {
    return this.safeExecute('getSubscriptionPlanByName', async () => {
      return await this.axiosInstance.req('GET', `subscription/plans/name/${planName}`);
    });
  }
  
  // 상태 확인 메서드들
  get isInitialized() {
    return this.initialized;
  }
  
  get loading() {
    return this.axiosInstance?.loading || false;
  }
  
  get error() {
    return this.axiosInstance?.error || null;
  }
}

// 싱글톤 인스턴스 생성
const paymentServiceInstance = new PaymentServiceClass();

// PaymentService Provider 컴포넌트
export const PaymentServiceProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const { req, loading, error } = UseAxios();
  
  useEffect(() => {
    const initializeService = async () => {
      try {
        await paymentServiceInstance.initialize({ req, loading, error });
        setIsReady(true);
      } catch (err) {
        console.error('PaymentService 초기화 실패:', err);
      }
    };
    
    initializeService();
  }, [req, loading, error]);
  
  return (
    <PaymentServiceContext.Provider value={{ 
      paymentService: paymentServiceInstance, 
      isReady 
    }}>
      {children}
    </PaymentServiceContext.Provider>
  );
};

// 안전한 PaymentService 훅
export const usePaymentService = () => {
  const context = useContext(PaymentServiceContext);
  
  if (!context) {
    throw new Error('usePaymentService는 PaymentServiceProvider 내에서 사용해야 합니다.');
  }
  
  return context;
};

// 하위 호환성을 위한 기존 방식 지원
const PaymentService = () => {
  const { req, loading, error } = UseAxios();
  
  // 자동 초기화
  useEffect(() => {
    const initializeService = async () => {
      if (!paymentServiceInstance.isInitialized) {
        await paymentServiceInstance.initialize({ req, loading, error });
      }
    };
    
    initializeService();
  }, [req, loading, error]);
  
  return paymentServiceInstance;
};

export default PaymentService;