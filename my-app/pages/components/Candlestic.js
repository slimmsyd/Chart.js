import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import MainData from '../../public/assets/XRP-USD.json';
import styles from '../../styles/chart.module.css'

const CandlestickChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Load data
      const ticker = MainData.map(d => ({
        ...d,
        Date: new Date(d.Date),
        Open: +d.Open,
        High: +d.High,
        Low: +d.Low,
        Close: +d.Close,
      }));

      // Declare the chart dimensions and margins.
      const width = 928;
      const height =880;
      const marginTop = 20;
      const marginRight = 30;
      const marginBottom = 30;
      const marginLeft = 40;

      // Declare the positional encodings.
      const x = d3.scaleTime()
        .domain(d3.extent(ticker, d => d.Date))
        .range([marginLeft, width - marginRight]);

      const y = d3.scaleLinear()
        .domain([d3.min(ticker, d => d.Low), d3.max(ticker, d => d.High)])
        .rangeRound([height - marginBottom, marginTop]);

      // Create the SVG container.
      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisRight(y);

      const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

      const yAxisGroup = svg.append("g")
        .attr("transform", `translate(${width - marginRight},0)`)
        .call(yAxis);

      const g = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .selectAll("g")
        .data(ticker)
        .join("g")
        .attr("transform", d => `translate(${x(d.Date)},0)`);

      g.append("line")
        .attr("y1", d => y(d.Low))
        .attr("y2", d => y(d.High));

      g.append("line")
        .attr("y1", d => y(d.Open))
        .attr("y2", d => y(d.Close))
        .attr("stroke", d => d.Open > d.Close ? d3.schemeSet1[0]
          : d.Close > d.Open ? d3.schemeSet1[2]
          : d3.schemeSet1[8]);

      const zoom = d3.zoom()
        .scaleExtent([0.5, 32])
        .translateExtent([[marginLeft, -Infinity], [width - marginRight, Infinity]])

        .on("zoom", zoomed);

      function zoomed({ transform }) {
        const zx = transform.rescaleX(x);
        const zy = transform.rescaleY(y);

        // Update the axes
        xAxisGroup.call(xAxis.scale(zx));
        yAxisGroup.call(yAxis.scale(zy));

        // Update the positions and attributes of the chart elements
        const visibleRange = zx.domain();
        const filteredData = ticker.filter(d => d.Date >= visibleRange[0] && d.Date <= visibleRange[1]);
        const candleWidth = Math.max(1, (width - marginLeft - marginRight) / filteredData.length * 0.8);

        g.attr("transform", d => `translate(${zx(d.Date)},0)`);
        g.selectAll("line")
          .attr("y1", d => zy(d.Low))
          .attr("y2", d => zy(d.High))
          .attr("stroke-width", candleWidth);
      }

      svg.call(zoom);
    }
  }, []);

  return (

    <div className = "chart-container">
      <div ref={chartRef} className = "candlestick_chart" />


      <div className = {`${styles.flex_row} ${styles.flex_start} ${styles.chart_dates_container}`}>
        <div className = {styles.dates}>
          1D
        </div>
        <div className = {styles.dates}>
          5D
        </div>
        <div className = {styles.dates}>
          1M
        </div>
        <div className = {styles.dates}>
          6M
        </div>
        <div className = {styles.dates}>
          1Y
        </div>
        <div className = {styles.dates}>
          5Y
        </div>
        <div className = {styles.dates}>
          All
        </div>


        <button className = {styles.icon_button}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="black" fill-rule="evenodd" d="M11 4h-1v2H7.5A2.5 2.5 0 0 0 5 8.5V13h1v-2h16v8.5c0 .83-.67 1.5-1.5 1.5H14v1h6.5a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 20.5 6H18V4h-1v2h-6V4Zm6 4V7h-6v1h-1V7H7.5C6.67 7 6 7.67 6 8.5V10h16V8.5c0-.83-.67-1.5-1.5-1.5H18v1h-1Zm-5.15 10.15-3.5-3.5-.7.7L10.29 18H4v1h6.3l-2.65 2.65.7.7 3.5-3.5.36-.35-.36-.35Z"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default CandlestickChart;
