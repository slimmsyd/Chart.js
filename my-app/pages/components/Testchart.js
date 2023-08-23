import React, { useEffect, useRef } from 'react';
import anychart from 'anychart';
import styles from '../../styles/chart.module.css'
import Image from 'next/image';
import searchIcon from '../../public/assets/search-icon.png'
import addIcon from '../../public/assets/add-icon.png';
const TeslaChart = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const loadChart = async () => {
      console.log('Chart initialization started');  // Add this line
      const response = await fetch(
        'https://gist.githubusercontent.com/shacheeswadia/cd509e0b0c03964ca86ae7d894137043/raw/5f336c644ad61728dbac93026f3268b86b8d0680/teslaDailyData.csv'
      );
      const csvData = await response.text();

      const dataTable = anychart.data.table();
      dataTable.addData(anychart.data.csv.parser().parse(csvData));

      const mapping = dataTable.mapAs({
        open: 1,
        high: 2,
        low: 3,
        close: 4,
      });

      const chart = anychart.stock();
      const plot = chart.plot(0);
      plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
      
      const leftYAxis = plot.yAxis(0);
      leftYAxis.labels().enabled(false);
      
      const rightYAxis = plot.yAxis(1);
      rightYAxis.orientation('right');
      rightYAxis.enabled(true);
      
      const series = plot.candlestick(mapping).name('Tesla');
      series.legendItem().iconType('rising-falling');
      
      chart.scroller().candlestick(mapping);
      
      chart.selectRange('2020-11-27', '2021-11-26');
      
      chart.container(containerRef.current);
      chart.draw();
      
      chartRef.current = chart;
      
    };

    loadChart();
  }, []);

  const changeTimeframe = (timeframe) => {
    const chart = chartRef.current;
    chart.selectRange('last-' + timeframe);
  };

  return (
    <div>

        {/* <div className = {styles.render_new_chart_container}>
            <div className = {styles.render_wrapper}>
               
                <div className = {`${styles.render_tag } ${styles.selected}`}>
                    EURUSD
                </div>
                <div className = {styles.render_tag}>
                    US30
                </div>
                <div className = {styles.render_tag}>
                    BTCUSD
                </div>
                <div className = {styles.render_tag}>
                    XAUSD
                </div>
                <div className = {styles.render_tag}>
                    AAPL
                </div>
                <div className = {styles.render_tag}>
                    GBPJPY
                </div>
                <div className = {styles.render_tag}>
                    SPX500
                </div>
                <div className = {styles.render_tag}>
                    GER30
                </div>
                <div className = {styles.render_tag}>
                    <div className = {styles.add_image_icon}>
                    <Image src = {addIcon} width={100} height={100} />

                    </div>
                </div>
            </div>

        </div>

        <div className = {styles.chart_selector}>

        <div className = {styles.search_bar}>
            
            <div className = {styles.search_icon}>
                <Image className = {styles.search_imageContainer} src = {searchIcon} width={100} height={100} />
            </div>

            EURO/USD
        </div>
      <button onClick={() => changeTimeframe('1m')}>1m</button>
      <button onClick={() => changeTimeframe('5m')}>5m</button>
      <button onClick={() => changeTimeframe('15m')}>15m</button>
      <button onClick={() => changeTimeframe('30m')}>30m</button>
      <button onClick={() => changeTimeframe('1h')}>1h</button>
      <button onClick={() => changeTimeframe('4h')}>4h</button>
      <button onClick={() => changeTimeframe('D')}>D</button>
      <button onClick={() => changeTimeframe('W')}>W</button>
      <button onClick={() => changeTimeframe('M')}>M</button>
      </div> */}

      <div ref={containerRef} style={{ width: '100%', height: '100vh' }}></div>
    </div>
  );
};

export default TeslaChart;
