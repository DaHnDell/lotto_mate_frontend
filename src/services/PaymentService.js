import UseAxios from '../hooks/UseAxios';

const PaymentService = () => {
  const { req, loading, error } = UseAxios();
  
  /**
   * 결제 검증 및 구독 정보 저장
   * @param {Object} paymentData - 포트원에서 받은 결제 데이터
   * @param {string} paymentData.imp_uid - 포트원 결제 고유번호
   * @param {string} paymentData.merchant_uid - 주문번호
   * @param {Object} subscriptionInfo - 구독 정보
   * @returns {Promise} - API 응답
   */
  const verifyPaymentAndCreateSubscription = async (paymentData, subscriptionInfo) => {
    try {
      const body = {
        imp_uid: paymentData.imp_uid,
        merchant_uid: paymentData.merchant_uid,
        plan: subscriptionInfo.plan,
        period: subscriptionInfo.period,
        amount: subscriptionInfo.amount
      };
      
      return await req('POST', 'subscription/verify-payment', body);
    } catch (err) {
      console.error('결제 검증 중 오류 발생:', err);
      throw err;
    }
  };
  
  /**
   * 구독 정보 조회
   * @returns {Promise} - 사용자의 구독 정보
   */
  const getSubscriptionInfo = async () => {
    try {
      return await req('GET', 'subscription/info');
    } catch (err) {
      console.error('구독 정보 조회 중 오류 발생:', err);
      throw err;
    }
  };
  
  /**
   * 결제 완료 후 구독 정보 상세 조회
   * @param {string} imp_uid - 포트원 결제 고유번호
   * @returns {Promise} - 구독 상세 정보
   */
  const getSubscriptionDetails = async (imp_uid) => {
    try {
      return await req('GET', `subscription/details?imp_uid=${imp_uid}`);
    } catch (err) {
      console.error('구독 상세 정보 조회 중 오류 발생:', err);
      throw err;
    }
  };
  
  /**
   * 구독 취소
   * @param {string} subscriptionId - 구독 ID
   * @param {string} reason - 취소 사유
   * @returns {Promise} - API 응답
   */
  const cancelSubscription = async (subscriptionId, reason) => {
    try {
      const body = {
        subscription_id: subscriptionId,
        reason: reason
      };
      
      return await req('POST', 'subscription/cancel', body);
    } catch (err) {
      console.error('구독 취소 중 오류 발생:', err);
      throw err;
    }
  };
  
  /**
   * 결제 영수증 조회
   * @param {string} imp_uid - 포트원 결제 고유번호
   * @returns {Promise} - 영수증 정보
   */
  const getPaymentReceipt = async (imp_uid) => {
    try {
      return await req('GET', `payment/receipt?imp_uid=${imp_uid}`);
    } catch (err) {
      console.error('결제 영수증 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 수단 등록
   * @param {Object} paymentMethodData - 결제 수단 데이터
   * @returns {Promise} - API 응답
   */
  const registerPaymentMethod = async (paymentMethodData) => {
    try {
      return await req('POST', 'payment/methods', paymentMethodData);
    } catch (err) {
      console.error('결제 수단 등록 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 수단 목록 조회
   * @returns {Promise} - 결제 수단 목록
   */
  const getPaymentMethods = async () => {
    try {
      return await req('GET', 'payment/methods');
    } catch (err) {
      console.error('결제 수단 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 수단 삭제
   * @param {number} paymentMethodId - 결제 수단 ID
   * @returns {Promise} - API 응답
   */
  const deletePaymentMethod = async (paymentMethodId) => {
    try {
      return await req('DELETE', `payment/methods/${paymentMethodId}`);
    } catch (err) {
      console.error('결제 수단 삭제 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 자동 갱신 설정 변경
   * @param {number} subscriptionId - 구독 ID
   * @param {boolean} autoRenewal - 자동 갱신 여부
   * @returns {Promise} - API 응답
   */
  const updateAutoRenewal = async (subscriptionId, autoRenewal) => {
    try {
      return await req('PUT', `subscription/${subscriptionId}/auto-renewal?autoRenewal=${autoRenewal}`);
    } catch (err) {
      console.error('자동 갱신 설정 변경 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 플랜 변경
   * @param {number} subscriptionId - 구독 ID
   * @param {string} planName - 변경할 플랜 이름 (basic, standard, premium)
   * @returns {Promise} - API 응답
   */
  const changePlan = async (subscriptionId, planName) => {
    try {
      return await req('PUT', `subscription/${subscriptionId}/plan?planName=${planName}`);
    } catch (err) {
      console.error('플랜 변경 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 수단 변경
   * @param {number} subscriptionId - 구독 ID
   * @param {number} paymentMethodId - 결제 수단 ID
   * @returns {Promise} - API 응답
   */
  const changePaymentMethod = async (subscriptionId, paymentMethodId) => {
    try {
      return await req('PUT', `subscription/${subscriptionId}/payment-method?paymentMethodId=${paymentMethodId}`);
    } catch (err) {
      console.error('결제 수단 변경 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 구독 생성
   * @param {Object} subscriptionData - 구독 생성 데이터
   * @returns {Promise} - API 응답
   */
  const createSubscription = async (subscriptionData) => {
    try {
      return await req('POST', 'subscription', subscriptionData);
    } catch (err) {
      console.error('구독 생성 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 구독 취소 이력 생성
   * @param {Object} cancellationData - 취소 이력 데이터
   * @returns {Promise} - API 응답
   */
  const createCancellation = async (cancellationData) => {
    try {
      return await req('POST', 'subscription/cancellation', cancellationData);
    } catch (err) {
      console.error('구독 취소 이력 생성 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 구독 취소 이력 목록 조회
   * @returns {Promise} - 취소 이력 목록
   */
  const getCancellationHistory = async () => {
    try {
      return await req('GET', 'subscription/cancellation');
    } catch (err) {
      console.error('구독 취소 이력 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 구독 취소 이력 상세 조회
   * @param {number} cancellationId - 취소 이력 ID
   * @returns {Promise} - 취소 이력 상세 정보
   */
  const getCancellationDetail = async (cancellationId) => {
    try {
      return await req('GET', `subscription/cancellation/${cancellationId}`);
    } catch (err) {
      console.error('구독 취소 이력 상세 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 정보 조회
   * @param {number} paymentId - 결제 ID
   * @returns {Promise} - 결제 정보
   */
  const getPaymentInfo = async (paymentId) => {
    try {
      return await req('GET', `payment/${paymentId}`);
    } catch (err) {
      console.error('결제 정보 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 로그 기록
   * @param {Object} logData - 로그 데이터
   * @returns {Promise} - API 응답
   */
  const logPaymentAction = async (logData) => {
    try {
      return await req('POST', 'payment/logs', logData);
    } catch (err) {
      console.error('결제 로그 기록 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 결제 로그 조회
   * @returns {Promise} - 결제 로그 목록
   */
  const getPaymentLogs = async () => {
    try {
      return await req('GET', 'payment/logs');
    } catch (err) {
      console.error('결제 로그 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 환불 요청
   * @param {Object} refundData - 환불 데이터
   * @returns {Promise} - API 응답
   */
  const refundPayment = async (refundData) => {
    try {
      return await req('POST', 'payment/refund', refundData);
    } catch (err) {
      console.error('환불 요청 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 구독 플랜 목록 조회
   * @returns {Promise} - 구독 플랜 목록
   */
  const getSubscriptionPlans = async () => {
    try {
      return await req('GET', 'subscription/plans');
    } catch (err) {
      console.error('구독 플랜 목록 조회 중 오류 발생:', err);
      throw err;
    }
  };

  /**
   * 구독 플랜 상세 조회
   * @param {string} planName - 플랜 이름
   * @returns {Promise} - 구독 플랜 상세 정보
   */
  const getSubscriptionPlanByName = async (planName) => {
    try {
      return await req('GET', `subscription/plans/name/${planName}`);
    } catch (err) {
      console.error('구독 플랜 상세 조회 중 오류 발생:', err);
      throw err;
    }
  };
  
  return {
    verifyPaymentAndCreateSubscription,
    getSubscriptionInfo,
    getSubscriptionDetails,
    cancelSubscription,
    getPaymentReceipt,
    registerPaymentMethod,
    getPaymentMethods,
    deletePaymentMethod,
    updateAutoRenewal,
    changePlan,
    changePaymentMethod,
    createSubscription,
    createCancellation,
    getCancellationHistory,
    getCancellationDetail,
    getPaymentInfo,
    logPaymentAction,
    getPaymentLogs,
    refundPayment,
    getSubscriptionPlans,
    getSubscriptionPlanByName,
    loading,
    error
  };
};

export default PaymentService;