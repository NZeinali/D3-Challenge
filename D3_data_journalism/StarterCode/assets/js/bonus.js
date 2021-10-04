// Define SVG area dimensions
var svgWidth = 825;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 100
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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(journalData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(journalData, d => d[chosenXAxis]) * 0.8,
      d3.max(journalData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(journalData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(journalData, d => d[chosenYAxis]) * 0.8,
        d3.max(journalData, d => d[chosenYAxis]) * 1.2
      ])
      .range([chartHeight, 0]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xLabel;

  if (chosenXAxis === "poverty") {
    xLabel = "Poverty: ";
  }
  else if (chosenXAxis === "age") {
    xLabel = "Age: ";
  }
  else {
    xLabel = "Household Income (Median): "; 
  }

  var yLabel;

  if (chosenYAxis === "healthcare") {
    yLabel = "Healthcare: ";
  }
  else if (chosenYAxis === "smokes") {
    yLabel = "Smokes: ";
  }
  else {
    yLabel = "Obesity: "; 
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// function used for updating circles' text with a transition to
// new axis
function renderText(circlesText, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
    
  return circlesText;
}



// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(journalData, err) {
  if (err) throw err;

  // parse data
  journalData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // Create LinearScale functions
  var xLinearScale = xScale(journalData, chosenXAxis);
  var yLinearScale = yScale(journalData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "teal")
    .attr("opacity", "0.4");

  // append initial circles
  var circlesText = chartGroup.selectAll("circle text")
  .data(journalData)
  .enter()
  .append("text")
  .text(function(d) {
    return d.abbr;
  })
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("font_family", "sans-serif")  // Font type
  .attr("font-size", "11px")  // Font size
  .attr("fill", "white")   // Font color
  .attr('font-weight', 'bold')
  .attr('text-anchor', 'middle');


  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");    

  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g");

  var obesityLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")    
  .attr("y", 0 - chartMargin.left + 15)
  .attr("x", 0 - (chartHeight / 2))
  .attr("value", "obesity") // value to grab for event listener
  .classed("active", true)
  .text("Obese (%)");


  var smokesLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")    
  .attr("y", 0 - chartMargin.left + 40)
  .attr("x", 0 - (chartHeight / 2))
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");

  var healthcareLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")    
  .attr("y", 0 - chartMargin.left + 60)
  .attr("x", 0 - (chartHeight / 2))
  .attr("value", "healthcare") // value to grab for event listener
  .classed("inactive", true)
  .text("Lacks Healthcare (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis, chosenYAxis);



        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(journalData, chosenXAxis);

        // updates x and y axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new axis values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlesText = renderText(circlesText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        circlesText = updateToolTip(chosenXAxis, chosenYAxis, circlesText);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
      }
    });


  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        console.log(chosenXAxis, chosenYAxis);



        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(journalData, chosenYAxis);

        // updates x and y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlesText = renderText(circlesText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);



        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        circlesText = updateToolTip(chosenXAxis, chosenYAxis, circlesText);
        
        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
      }
    });





}).catch(function(error) {
  console.log(error);
});
