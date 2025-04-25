import React, { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const DEFAULT_RANGE = 50;
const MAX_RANGE = 100;

const RangeSelector = ({ maxRound = 1168, onRangeChange }) => {
  const [range, setRange] = useState([maxRound - DEFAULT_RANGE + 1, maxRound]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (onRangeChange) {
      onRangeChange(range[0], range[1]);
    }
    // eslint-disable-next-line
  }, []);

  const handleSliderChange = (event, newRange) => {
    const [start, end] = newRange;
    if (end - start + 1 > MAX_RANGE) {
      return;
    }
    setRange(newRange);
    if (onRangeChange) {
      onRangeChange(start, end);
    }
  };

  const handleTrackClick = (e) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const center = Math.round(ratio * maxRound);
    const start = Math.max(center - Math.floor(DEFAULT_RANGE / 2), 1);
    const end = Math.min(start + DEFAULT_RANGE - 1, maxRound);
    setRange([start, end]);
    if (onRangeChange) {
      onRangeChange(start, end);
    }
  };

  return (
    <div className="range-selector mb-4">
      <Typography align="center" className="mb-2 fw-bold">
        조회 회차 범위: {range[0]}회 ~ {range[1]}회 ({range[1] - range[0] + 1}회)
      </Typography>

      <div ref={sliderRef} onClick={handleTrackClick}>
        <Slider
          value={range}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={1}
          max={maxRound}
          disableSwap
          step={1}
          marks={[
            { value: 1, label: '1회' },
            { value: maxRound, label: `${maxRound}회` },
          ]}
        />
      </div>

      <Typography align="center" variant="body2" className="mt-3 text-muted">
        최대 <strong>100회차</strong>까지 히트맵으로 당첨번호 분석이 가능합니다. <br />
        로또메이트는 동행복권 데이터의 <strong>신뢰성</strong>과 <strong>정합성</strong>, 그리고 <strong>정밀한 분석</strong> 을 위해 <br />
        최대 <strong>50회차</strong>씩만 도표화 후 분석하시는 것을 권장합니다.
      </Typography>
    </div>
  );
};

export default RangeSelector;
