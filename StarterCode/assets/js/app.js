// Define SVG area dimensions
var svgWidth = 825;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(journalData) {

  console.log(journalData);

  // Format the data (string to number)
  journalData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;

  });

  // Create scales for the chart
  var xScaler = d3.scaleLinear()
    .domain([8, d3.max(journalData, d => d.poverty)])
    .range([0, chartWidth]);

  var yScaler = d3.scaleLinear()
    .domain([4, d3.max(journalData, d => d.healthcare)])
    .range([chartHeight, 0]);   
    
  // Create axis
  var bottomAxis = d3.axisBottom(xScaler);
  var leftAxis = d3.axisLeft(yScaler);


  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);


  // Add y-axis
  chartGroup.append("g")
    .call(leftAxis);


  var circleGroup = chartGroup.selectAll('circle')
  .data(journalData)
  .enter()
  .append('circle')
  .attr('cx', d => xScaler(d.poverty))
  .attr('cy', d => yScaler(d.healthcare))
  .attr('r', '15')
  .attr('fill', 'teal')
  .style("opacity", 0.6);

  // Add Text Labels
  chartGroup.selectAll("circle text")
    .data(journalData)
    .enter()
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("x", function(d) {
      return xScaler(d.poverty);  // Returns scaled location of x
    })
    .attr("y", function(d) {
      return yScaler(d.healthcare);  // Returns scaled circle y
    })
    .attr("font_family", "sans-serif")  // Font type
    .attr("font-size", "11px")  // Font size
    .attr("fill", "white")   // Font color
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle');



  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left )
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.bottom - 60})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");



  }).catch(function(error) {
    console.log(error);
  });
  
