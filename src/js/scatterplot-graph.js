// Data URL
var dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Title element
var title = d3.select('.dataVisContainer')
  .append('div')
  .attr('id', 'title')
  .text('Doping in Professional Bicycle Racing');

// Offset values
var xOffset = 50;
var yOffset = 5;

// Size variables
var titleHeight = document.getElementById('title').clientHeight;
var width = document.getElementById('container').clientWidth - 150;
var height = document.getElementById('container').clientHeight - titleHeight - 100;

// Formatting
var color = d3.scaleOrdinal(d3.schemeCategory10);
var timeFormat = d3.timeFormat("%M:%S");

// X Axis
var xScale = d3.scaleLinear()
  .range([0, width]);
    
var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))

// Y Axis
var yScale = d3.scaleTime()
  .range([0, height]);
    
var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)
    
// Tooltip
var tooltip = d3.select('.dataVisContainer')
  .append('div')
  .attr("id", "tooltip")
  .style("opacity", 0);
    
var svgContainer =  d3.select('.dataVisContainer')
  .append('svg')
  .attr('width', width + 75)
  .attr('height', height + 75);
    
// Subtitle
svgContainer.append("text")
  .attr("x", (width / 2))             
  .attr("y", 42)
  .attr("text-anchor", "middle")  
  .style("font-size", "1.3em") 
  .text("Fastest times up Alpe d'Huez");
    
d3.json(dataURL).then((data) => {

  data.forEach((d) => {
    d.Place = +d.Place;
    var parsedTime = d.Time.split(':');
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  xScale.domain([
    d3.min(data, (d) => d.Year - 1),
    d3.max(data, (d) => d.Year + 1)
  ]);

  yScale.domain([
    d3.min(data, (d) => new Date(d.Time).setSeconds(d.Time.getSeconds() - 5)),
    d3.max(data, (d) => new Date(d.Time).setSeconds(d.Time.getSeconds() + 5))
  ]);

  // Add X Axis
  svgContainer.append("g")
    .attr("class", "x axis")
    .attr("id","x-axis")
    .attr("transform", `translate(${xOffset}, ${(height + yOffset)})`)
    .call(xAxis)

  // Add Y Axis
  svgContainer.append("g")
    .attr("class", "y axis")
    .attr("id","y-axis")
    .attr("transform", `translate(${xOffset}, ${yOffset})`)
    .call(yAxis)
  
  // Add Axis label
  svgContainer.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -135)
    .attr('y', 75)
    .style('font-size', 18)
    .text('Time in Minutes');
    
  // Define dots
  svgContainer.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 10)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", (d) => xScale(d.Year) + xOffset)
    .attr("cy", (d) => yScale(d.Time) + yOffset)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .style("fill", (d) => color(d.Doping != ""))
    .on("mouseover", (d) => {
      tooltip.style("opacity", .9);
      tooltip.attr("data-year", d.Year)
      tooltip.html(d.Name + ": " + d.Nationality + "<br/>"
              + "Year: " +  d.Year + ", Time: " + timeFormat(d.Time) 
              + (d.Doping?"<br/><br/>" + d.Doping:""))
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => tooltip.style("opacity", 0));
  
  // Legend
  var legend = svgContainer.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", (d, i) => `translate(0, ${(height/4 - i * 25)})`);

  legend.append("circle")
    .attr("r", 10)
    .attr("cx", width - 18)
    .attr("transform", "translate(10, 9)")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => {
      return (d) ? "Riders with doping allegations" : "Riders without doping allegations";
    });

});