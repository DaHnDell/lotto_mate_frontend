import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import LottoHeatmap from './LottoHeatmap';
import LottoFrequency from './LottoFrequency';
import RangeSelector from './RangeSelector';
import UseAxios from '../../hooks/UseAxios';

export default function LottoChartPage() {
  const { req } = UseAxios();
  const [maxRound, setMaxRound] = useState(null);
  const [heatmapRange, setHeatmapRange] = useState([1, 1]); // 초기 빈 값

  useEffect(() => {
    const fetchMaxRound = async () => {
      try {
        const res = await req('get', 'lotto/latest');
        const latest = res?.data || res;
        const drawRound = latest.drawRound;

        setMaxRound(drawRound);
        setHeatmapRange([Math.max(drawRound - 49, 1), drawRound]);
      } catch (err) {
        console.error('최신 회차 불러오기 실패', err);
      }
    };

    fetchMaxRound();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (maxRound) {
      setStartRound(Math.max(maxRound - 99, 1));
      setEndRound(maxRound);
    }
  }, [maxRound]);

  const [hitmap, setHitmap] = useState(null);

  const [startRound, setStartRound] = useState(1000);
  const [endRound, setEndRound] = useState(1100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startRound > endRound) {
      alert("시작 회차는 끝 회차보다 작거나 같아야 합니다.");
      return;
    }

    try {
      const res = await req('get', `lotto/stats/history-heatmap?startRound=${startRound}&endRound=${endRound}`);
      const responseData = res?.data || res;
      const hitmap = responseData.hitmap;

      if (!hitmap || typeof hitmap !== 'object') {
        alert("유효하지 않은 데이터입니다.");
        return;
      }

      setHitmap(hitmap);
    } catch (err) {
      console.error('분석용 히트맵 조회 실패:', err);
      alert("분석 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="lotto-heatmap-page">
      <Header />
      <div className="container my-5 py-5">
        <h2 className="text-center mb-4 fw-bold"> 로또메이트 기록보관소 </h2>

        {/* 히트맵 전용 범위 선택자 */}
        {maxRound && (
          <>
            <RangeSelector
              maxRound={maxRound}
              onRangeChange={(start, end) => setHeatmapRange([start, end])}
            />

            <LottoHeatmap
              startRound={heatmapRange[0]}
              endRound={heatmapRange[1]}
              onHitmapReady={setHitmap}
            />
          </>
        )}

        <hr className="my-5" />

        <h3 className="text-center mb-4 fw-bold">번호별 출현 차트 분석</h3>

        {/* 분석 회차 입력 폼 */}
        {maxRound && (
          <>
            <form
              onSubmit={handleSubmit}
              className="d-flex justify-content-center gap-3 mb-4 flex-wrap"
            >
              <div>
                <label htmlFor="startRound" className="form-label">시작 회차</label>
                <input
                  type="number"
                  id="startRound"
                  className="form-control"
                  value={startRound}
                  min="1"
                  max={endRound}
                  onChange={(e) => setStartRound(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="endRound" className="form-label">끝 회차</label>
                <input
                  type="number"
                  id="endRound"
                  className="form-control"
                  value={endRound}
                  min={startRound}
                  max={maxRound}
                  onChange={(e) => setEndRound(Number(e.target.value))}
                />
              </div>
              <div className="align-self-end">
                <button type="submit" className="btn btn-primary fw-bold">분석하기</button>
              </div>
            </form>

            <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              최근 {endRound - startRound + 1}회 기준 분석입니다. (최대 {maxRound}회차)
            </p>

            {hitmap && (
              <LottoFrequency hitmap={hitmap} />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

