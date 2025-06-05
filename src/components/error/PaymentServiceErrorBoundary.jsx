import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { ExclamationTriangleFill, ArrowRepeat } from 'react-bootstrap-icons';

class PaymentServiceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 state를 업데이트하여 에러 UI를 보여줌
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 정보를 저장합니다.
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // 에러 로깅 (실제 프로덕션에서는 에러 추적 서비스로 전송)
    console.error('PaymentService 에러:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="my-5">
          <Alert variant="danger" className="text-center">
            <div className="d-flex flex-column align-items-center">
              <ExclamationTriangleFill size={48} className="mb-3 text-danger" />
              <h4 className="alert-heading">결제 서비스 오류</h4>
              <p className="mb-3">
                결제 서비스에 일시적인 문제가 발생했습니다. 
                잠시 후 다시 시도해주세요.
              </p>
              
              {/* 개발 환경에서만 상세 에러 정보 표시 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-3 w-100">
                  <summary className="btn btn-outline-danger btn-sm mb-2">
                    개발자 정보 (상세 에러)
                  </summary>
                  <div className="alert alert-secondary small text-start">
                    <strong>Error:</strong> {this.state.error.toString()}
                    <br />
                    <strong>Component Stack:</strong>
                    <pre className="mt-2">{this.state.errorInfo.componentStack}</pre>
                  </div>
                </details>
              )}
              
              <div className="d-flex gap-2 mt-3">
                <Button 
                  variant="outline-danger" 
                  onClick={this.handleRetry}
                  className="d-flex align-items-center gap-2"
                >
                  <ArrowRepeat /> 다시 시도
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => window.location.href = '/'}
                >
                  홈으로 가기
                </Button>
              </div>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

// 사용하기 쉬운 HOC (Higher-Order Component) 패턴
export const withPaymentServiceErrorBoundary = (WrappedComponent) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <PaymentServiceErrorBoundary>
        <WrappedComponent {...props} />
      </PaymentServiceErrorBoundary>
    );
  };
};

// 함수형 컴포넌트에서 사용할 수 있는 훅
export const usePaymentServiceErrorHandler = () => {
  const handleError = (error, errorInfo = {}) => {
    console.error('PaymentService 에러 처리:', error);
    
    // 에러 타입별 처리
    if (error.name === 'NetworkError') {
      throw new Error('네트워크 연결을 확인해주세요.');
    } else if (error.message?.includes('401')) {
      throw new Error('로그인이 필요합니다.');
    } else if (error.message?.includes('403')) {
      throw new Error('권한이 없습니다.');
    } else if (error.message?.includes('500')) {
      throw new Error('서버에 일시적인 문제가 발생했습니다.');
    } else {
      throw new Error('예상치 못한 오류가 발생했습니다.');
    }
  };

  return { handleError };
};

export default PaymentServiceErrorBoundary;