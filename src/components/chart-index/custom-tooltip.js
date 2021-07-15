import React from 'react';
import { timeFormat } from 'd3';

export default function CustomTooltip({ active, payload, label, unit }) {
  const formatDate = timeFormat('%Y-%m-%d');

  const style = {
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    fontSize: '10px'
  };

  if (active) {
    const currData = payload && payload.length ? payload[0].payload : null;
    return (
      <div style={style}>
        <p>
          {currData ? formatDate(new Date(currData.x)) : ' -- '}<br />
          {currData ? currData.y.toLocaleString() + ' ' + unit : ' -- '}
        </p>
      </div>
    );
  }

  return null;
};