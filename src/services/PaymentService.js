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
  
  return {
    verifyPaymentAndCreateSubscription,
    getSubscriptionInfo,
    getSubscriptionDetails,
    cancelSubscription,
    getPaymentReceipt,
    loading,
    error
  };
};

export default PaymentService;