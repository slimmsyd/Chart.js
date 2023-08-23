import React, { useEffect, useRef } from 'react';
import { CIQ } from 'chartiq/js/chartiq'; // Adjust the import path based on your setup

const ChartComponent = ({ data }) => {
  const chartContainerRef = useRef(null);
  const stxRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current && !stxRef.current) {
      const stx = new CIQ.ChartEngine({
        container: chartContainerRef.current,
        // ...other ChartIQ configuration options
      });
      stxRef.current = stx;
    }

    if (stxRef.current && data) {
      stxRef.current.newChart('symbol', data);
    }

    return () => {
      // Clean up code if needed
      stxRef.current.destroy();
    };
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default ChartComponent;
