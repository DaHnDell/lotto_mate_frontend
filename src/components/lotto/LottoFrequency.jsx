import React from 'react';
import { Bar } from 'react-chartjs-2';
// eslint-disable-next-line
import Chart from 'chart.js/auto';

export default function LottoFrequency({ hitmap }) {
  const frequencies = getNumberFrequencies(hitmap);

  const data = {
    labels: Array.from({ length: 45 }, (_, i) => `${i + 1}`),
    datasets: [{
      label: '번호별 출현 횟수',
      data: frequencies,
      backgroundColor: '#1e88e5',
    }]
  };

  const options = {
    plugins: {
      legend: { display: false },
      title: { display: true, text: '번호별 출현 통계' }
    },
    scales: {
      x: { title: { display: true, text: '번호' } },
      y: { title: { display: true, text: '등장 횟수' }, beginAtZero: true }
    },
    responsive: true
  };

  return <Bar data={data} options={options} />;
}

function getNumberFrequencies(hitmap) {
  const result = [];
  for (let num = 1; num <= 45; num++) {
    const roundMap = hitmap[num.toString()];
    if (!roundMap) continue;
    const freq = Object.values(roundMap).reduce((acc, v) => acc + (v === 1 ? 1 : 0), 0);
    result.push(freq);
  }
  return result;
}