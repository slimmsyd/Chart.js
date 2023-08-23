import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import MainData from '../../public/assets/NTDOY.json';

const FinancialChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const loadChart = () => {
      const margin = {top: 70, right: 100, bottom: 50, left: 80};
      const width = 1120 - margin.left - margin.right; // Adjusted width
      const height = 900 - margin.top - margin.bottom; // Adjusted height
      
      //Set up x and y scales 
      const x = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      //Create the SVG element and append it to the chart container 
      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right) // SVG width includes the chart area and the margins
        .attr("height", height + margin.top + margin.bottom) // SVG height includes the chart area and the margins
        .append('g')
        .attr("transform", `translate(${margin.left},${margin.top})`); // Translate the 'g' element to accommodate the left and top margins

      //Creating Price Tool Tip Div 
      const tooltip = d3.select('body')
      .append("div")
      .attr("class", "tooltip")

      //Create our Graident 
      const tooltipRawDate = d3.select("body")
      .append("div")
      .attr("class", "tooltip");

      const gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("x2", "0%")
  .attr("y1", "0%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");

gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#85bb65")
  .attr("stop-opacity", 1);

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#85bb65")
  .attr("stop-opacity", 0);

      // Process the data 
      const data = MainData;
      const parseDate = d3.timeParse("%Y-%m-%d");
      data.forEach(d => { 
        d.Date = parseDate(d.Date);
        d.Close = +d.Close;
      });

      // Set the domains for the X and Y scales 
      x.domain(d3.extent(data, d => d.Date));
      y.domain([0, d3.max(data, d => d.Close)]);

      // Add the x-axis
 // Add the x-axis
svg.append('g')
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat('%Y')))
.selectAll(".tick text")
.style("stroke-opacity", 1);
svg.selectAll(".tick text")
.attr("fill", "#777")


      // Add the y-axis
      svg.append('g')
        .attr('class' ,'x-axis')
        .attr("transform", `translate(${width}, 0)`)
        .style('font-size', '12px')
        .call(d3.axisBottom(x))

        .call(d3.axisRight(y).tickFormat(d => { 
          if( isNaN(d)) return;
          return `$${d.toFixed(2)}`
        }));


        //Build and line generater
        const line = d3.area()
        .x(d => x(d.Date))
        .y(d => y(d.Close))

        const area = d3.area()
        .x(d => x(d.Date))
        .y0(height)
        .y1(d => y(d.Close))

        //Add the area path to svg
        svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "#85bb65")
        .style("opacity", .5)

        //Add the line path.
        svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr('fill', "none")
        .attr("stroke", "#85bb65")
        .attr("stroke-width", 1)
        .attr("d", line)
      

        //Add circle to follow mouse around when hovering over the chart 
        const circle = svg.append("circle")
          .attr("r", 0)
          .attr("fill", "red")
          .style("stroke", "white")
          .attr("opacity", 0.7)
          .style("pointer-events", "none")

          //Add red lines exending from circel to the date and value 
          const tooltipLineX = svg.append("line")
            .attr("class", "tooltip-line")
            .attr("id", "tooltip-line-x")
            .attr("stroke", "red")
            .attr("stroke-width", 1 )
            .attr("stroke-dasharray", "2.2")


            const tooltipLineY = svg.append("line")
              .attr("class", "tooltip-line")
              .attr("id", "tooltip-line-y")
              .attr("stroke", "red")
              .attr("stroke-width", 1 )
              .attr("stroke-dasharray", "2.2")


              //Create a listneing rectangele
            const listeningRect = svg.append("rect")
                .attr("width", width)
                .attr("height",height)


              //create a mouse move function
              listeningRect.on('mousemove', function(event)
              { 
                const [xCoord] = d3.pointer(event, this);
                const bisectDate = d3.bisector(d => d.Date).left
                const x0 = x.invert(xCoord)
                const i = bisectDate(data, x0, 1)
                const d0 = data[i - 1]
                const d1 = data[i]
                const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
                const xPos = x(d.Date);
                const yPos = y(d.Close);
              //update the circle position
              circle.attr("cx", xPos).attr("cy", yPos)

              circle.transition()
                .duration(50)
                .attr("r", 5);


            //Update the position of our red lines 
            tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", height);
            tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", width);


            //add in our tooltipo
            tooltip
            .style("display", "block")
            .style("left", `${width + 90}px`)
            .style("top", `${yPos + 68}px`)
            .html(`$${d.Close !== undefined ? d.Close.toFixed(2) : 'N/A'}`);2 

            tooltipRawDate
            .style("display", "block")
            .style("left", `${xPos + 60}px`)
            .style("top", `${height + 53}px`)
            .html(`${d.Date !== null && d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : 'N/A'}`);
          
          })

          listeningRect.on('mouseleave', () => {
            circle.transition().duration(50).attr("r",0)
            tooltip.style("display", "none")
            tooltipRawDate.style('display', 'none')
            tooltipLineX.attr('x1', 0).attr('x2', 0)
            tooltipLineY.attr('y1', 0).attr("y2", 0);
            tooltipLineX.style("display", 'none');
            tooltipLineY.style('display', "none")


          })

          // ...

// Define the initial domain for the x scale
const initialDomain = [d3.min(data, d => d.Date), d3.max(data, d => d.Date)];

// Set the initial domain for the x scale
x.domain(initialDomain);

// ...

// Add a 'wheel' event listener to the SVG element
svg.on('wheel', function(event) {
  // Get the current domain of the x scale
  const currentDomain = x.domain();

  // Define the zoom factor
  const zoomFactor = 0.1;

  // Calculate the new domain based on the scroll direction
  const newDomain = event.deltaY > 0 ? 
    [currentDomain[0] - (currentDomain[1] - currentDomain[0]) * zoomFactor, currentDomain[1] + (currentDomain[1] - currentDomain[0]) * zoomFactor] :
    [currentDomain[0] + (currentDomain[1] - currentDomain[0]) * zoomFactor, currentDomain[1] - (currentDomain[1] - currentDomain[0]) * zoomFactor];

  // Update the x scale's domain
  x.domain(newDomain);

  // Filter the data based on the new domain
  const filteredData = data.filter(d => d.Date >= newDomain[0] && d.Date <= newDomain[1]);

  // Update the line and area to the new domain
  svg.select(".line").attr("d", line(filteredData));
  svg.select(".area").attr("d", area(filteredData));

  // Set the new domain for the y scale based on the filtered data
  y.domain([0, d3.max(filteredData, d => d.Close)]);

  // Update the x-axis with the new domain
  svg.select(".x-axis")
    .transition()
    .duration(300) // transition duration in ms
    .call(d3.axisBottom(x)
      .tickValues(x.ticks(d3.timeYear.every(1)))
      .tickFormat(d3.timeFormat("%Y")));

  // Update the y-axis with the new domain
  svg.select(".y-axis")
    .transition()
    .duration(300) // transition duration in ms
    .call(d3.axisRight(y)
      .ticks(10)
      .tickFormat(d => {
        if (d <= 0) return "";
        return `$${d.toFixed(2)}`;
      }));
});


          //Define the slider 


           
    }

    loadChart();
  });

  return (
    <>
      <div className="chart-container">
        <div ref={chartRef} id="chart" />
        <div id = "slider-range"></div>
      </div>
    </>
  );
};

export default FinancialChart;
