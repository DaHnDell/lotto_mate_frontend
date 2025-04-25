import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const calcRange = (center, maxRound = 1168) => {
  const start = Math.max(center - 25, 1);
  const end = Math.min(center + 24, maxRound);
  return [start, end];
};

const LottoTimeLine = ({ maxRound = 1168, onClickRound }) => {
  const checkpoints = [];
  const step = 100;

  for (let i = step; i <= maxRound; i += step) {
    checkpoints.push(i);
  }
  if (!checkpoints.includes(maxRound)) {
    checkpoints.push(maxRound);
  }

  return (
    <div className="timeline-navigation d-flex justify-content-center flex-wrap gap-2 my-4">
      <ButtonGroup>
        {checkpoints.map((round, index) => (
          <Button
            key={index}
            variant="outline-primary"
            size="sm"
            onClick={() => onClickRound && onClickRound(round)}
          >
            {round}회
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default LottoTimeLine;
export { calcRange };
