import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import sampleData from '../../public/assets/sample-data.json';
import { zoom } from 'd3-zoom';


const D3Chart = () => {
  const chartRef = useRef();

  const responsivefy = (svg) => {
    const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width')),
      height = parseInt(svg.style('height')),
      aspect = width / height;
  
    const resize = () => {
      const targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    };
  
    svg
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('perserveAspectRatio', 'xMinYMid')
      .call(resize);
  
    d3.select(window).on('resize.' + container.attr('id'), resize);
  };
  

  const movingAverage = (data, numberOfPricePoints) => {
    return data.map((row, index, total) => {
      const start = Math.max(0, index - numberOfPricePoints);
      const end = index;
      const subset = total.slice(start, end + 1);
      const sum = subset.reduce((a, b) => {
        return a + b['close'];
      }, 0);
      return {
        date: row['date'],
        average: sum / subset.length
      };
    });
  };
  

  const initialiseChart = (data) => {
    data = data.filter(
      row => row['high'] && row['low'] && row['close'] && row['open']
    );
  
    const thisYearStartDate = new Date(2018, 0, 1);
  
    // filter out data based on time period
    data = data.filter(row => {
      if (row['date']) {
        return row['date'] >= thisYearStartDate;
      }
    });
  
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;
  
    const xMin = d3.min(data, d => d['date']);
    const xMax = d3.max(data, d => d['date']);
    const yMin = d3.min(data, d => d['close']);
    const yMax = d3.max(data, d => d['close']);
  
    const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
    const xScaleOriginal = xScale.copy();
    const yScale = d3.scaleLinear().domain([yMin - 5, yMax]).range([height, 0]);
  
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin['left'] + margin['right'])
      .attr('height', height + margin['top'] + margin['bottom'])
      .call(responsivefy)
      .append('g')
      .attr('transform', `translate(${margin['left']}, ${margin['top']})`);
  
    svg
      .append('g')
      .attr('id', 'xAxis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
  
    svg
      .append('g')
      .attr('id', 'yAxis')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yScale));
  
    const candleWidth = 5;
    const gap = 2;
  
    const candlestick = svg.append("g")
      .attr("class", "candlestick");
  
    data.forEach((d, i) => {
      const x = xScale(d.date) + i * gap;
      const yOpen = yScale(d.open);
      const yClose = yScale(d.close);
      const yHigh = yScale(d.high);
      const yLow = yScale(d.low);
  
      candlestick.append("rect")
        .attr("x", x - candleWidth / 2)
        .attr("y", Math.min(yOpen, yClose))
        .attr("width", candleWidth)
        .attr("height", Math.abs(yOpen - yClose))
        .attr("fill", d.close > d.open ? "green" : "red");
  
      candlestick.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", yHigh)
        .attr("y2", yLow)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .lower();
    });
  
    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 5])
      .on("zoom", zoomed);
    svg.call(zoomBehavior);
  
    function zoomed(event) {
      const transform = event.transform;
      xScale.domain(transform.rescaleX(xScaleOriginal).domain());
      svg.select("#xAxis").call(d3.axisBottom(xScale));
      candlestick.attr("transform", transform)
        .attr("stroke-width", 1 / transform.k);
    }
  };
  

  useEffect(() => {
    const chartResultsData = sampleData['chart']['result'][0];
    const quoteData = chartResultsData['indicators']['quote'][0];

    const data = chartResultsData['timestamp'].map((time, index) => ({
      date: new Date(time * 1000),
      high: quoteData['high'][index],
      low: quoteData['low'][index],
      open: quoteData['open'][index],
      close: quoteData['close'][index],
      volume: quoteData['volume'][index]
    }));

    initialiseChart(data);
  }, []);

  return (
    <div className = "chart-container">
    <div ref={chartRef} id="chart" />

    </div>
  );
};

export default D3Chart;
