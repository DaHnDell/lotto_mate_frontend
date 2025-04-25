import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import LottoHeatmap from './LottoHeatmap';

export default function LottoChartPage() {

  const [startRound, setStartRound] = useState(1000);
  const [endRound, setEndRound] = useState(1100);
  const [range, setRange] = useState({ start: 1000, end: 1100 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startRound > endRound) {
      alert("시작 회차는 끝 회차보다 작거나 같아야 합니다.");
      return;
    }
    setRange({ start: startRound, end: endRound });
  };

  return (
    <div className="lotto-heatmap-page">
      <Header />
      <div className="container my-5 py-5">
        <h3 className="text-center mb-4 fw-bold">로또메이트 아카이브</h3>
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
              max="1168"
              onChange={(e) => setEndRound(Number(e.target.value))}
            />
          </div>
          <div className="align-self-end">
            <button
              type="submit"
              className="btn btn-primary fw-bold"
            >
              조회
            </button>
          </div>
        </form>
        <LottoHeatmap  startRound={range.start} endRound={range.end}/>
      </div>
      <Footer />
    </div>
  )
}
