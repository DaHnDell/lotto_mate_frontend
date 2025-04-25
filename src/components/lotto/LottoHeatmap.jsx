import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import axios from 'axios';
import useAxios from '../../hooks/UseAxios';

ChartJS.register(
  LinearScale,
  MatrixController,
  MatrixElement,
  Tooltip,
  Legend,
  Title
);

const LottoHeatmap = ({ startRound = 1000, endRound = 1100 }) => {
  const { req } = useAxios();
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchHistoryHeatmap = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;

        try {
          response = await req('get', `lotto/stats/history-heatmap?startRound=${startRound}&endRound=${endRound}`);
        } catch (prodError) {
          console.error('Production API failed:', prodError);

          if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            console.log('Falling back to local API');
            try {
              response = await axios.get(`http://localhost:8080/api/lotto/stats/history-heatmap?startRound=${startRound}&endRound=${endRound}`);
            } catch (localError) {
              console.error('Local API also failed:', localError);
              throw prodError;
            }
          } else {
            throw prodError;
          }
        }

        // console.log("API Response:", response);


        const responseData = response.data?.data || response.data;
        const hitmap = responseData?.hitmap;

        if (!hitmap || typeof hitmap !== 'object') {
          console.warn('히트맵 응답 형식이 잘못되었거나 비어 있음:', responseData);
          setError('히트맵 데이터 형식이 유효하지 않습니다.');
          return;
        }

        const transformed = Object.entries(hitmap).flatMap(([num, roundMap]) =>
          Object.entries(roundMap).map(([round, hit]) => ({
            x: parseInt(round),
            y: parseInt(num),
            v: hit
          }))
        );

        if (transformed.length === 0) {
          setError('데이터가 없습니다. 다른 회차 범위를 시도해보세요.');
          return;
        }

        setMatrixData(transformed);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('히스토리컬 히트맵 조회 실패:', err);

        // More detailed error message
        if (err.response) {
          // The request was made and the server responded with a status code
          console.error('Server response:', err.response.data);
          console.error('Status:', err.response.status);

          if (err.response.status === 500) {
            setError(`서버 내부 오류가 발생했습니다. 현재 서비스 점검 중일 수 있습니다. 잠시 후 다시 시도해주세요.`);
          } else {
            setError(`서버 오류 (${err.response.status}): ${err.response.data?.message || '알 수 없는 오류가 발생했습니다.'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          setError('서버로부터 응답이 없습니다. 인터넷 연결을 확인하고 나중에 다시 시도해 주세요.');
        } else {
          // Something happened in setting up the request
          console.error('Request error:', err.message);
          setError(`요청 오류: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryHeatmap();
  }, [req, startRound, endRound, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Try with a smaller range
  const handleTrySmallerRange = () => {
    const newEndRound = Math.min(endRound, startRound + 20);
    window.location.href = `/stats/heatmap?startRound=${startRound}&endRound=${newEndRound}`;
  };

  const chartData = {
    datasets: [
      {
        label: '히스토리컬 번호 히트맵',
        data: matrixData,
        backgroundColor: (ctx) => ctx.raw?.v ? '#1e88e5' : '#e0e0e0',
        width: () => 12,
        height: () => 12,
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: '회차', font: { weight: 'bold' } },
        min: startRound,
        max: endRound,
        ticks: {
          stepSize: 10,
          callback: (val) => (val % 10 === 0 ? val : ''),
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        type: 'linear',
        title: { display: true, text: '번호 (1~45)', font: { weight: 'bold' } },
        min: 1,
        max: 45,
        ticks: { stepSize: 5 },
        reverse: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (ctx) => `번호: ${ctx[0].raw.y}`,
          label: (ctx) => `회차 ${ctx.raw.x} - ${ctx.raw.v ? '등장' : '미등장'}`,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 4,
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          generateLabels: (chart) => [
            {
              text: '출현',
              fillStyle: '#1e88e5',
              strokeStyle: '#1e88e5',
              lineWidth: 1,
              hidden: false,
              index: 0,
            },
            {
              text: '미출현',
              fillStyle: '#e0e0e0',
              strokeStyle: '#e0e0e0',
              lineWidth: 1,
              hidden: false,
              index: 1,
            },
          ]
        }
      },
      title: {
        display: true,
        text: `로또 번호 히트맵 (${startRound}회차 ~ ${endRound}회차)`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    }

  };

  if (error) {
    return (
      <div style={{
        height: '600px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <p style={{ color: 'red', fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}>
          {error}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1e88e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            다시 시도
          </button>
          <button
            onClick={handleTrySmallerRange}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            더 작은 범위로 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '600px',
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {loading ? (
        <div style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1e88e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#666', marginTop: '10px' }}>데이터를 불러오는 중...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        matrixData.length > 0 ? (
          <Chart
            key={`matrix-${startRound}-${endRound}-${matrixData.length}`}
            type="matrix"
            data={chartData}
            options={chartOptions}
          />
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}>
            <p style={{ fontSize: '16px', color: '#666' }}>데이터가 없습니다.</p>
            <button
              onClick={handleTrySmallerRange}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              더 작은 범위로 시도
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default LottoHeatmap;