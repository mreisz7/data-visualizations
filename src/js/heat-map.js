// Define the Data URL
var dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Title element
var title = d3.select('.dataVisContainer')
    .append('div')
    .attr('id', 'title')
    .text('Monthly Global Land-Surface Temperature');

// Size variables
var titleHeight = document.getElementById('title').clientHeight;
var width = document.getElementById('container').clientWidth - 150;
var height = document.getElementById('container').clientHeight - titleHeight - 100;

// Define the color palette
var colorPalette = [
  '#a50026',
  '#d73027',
  '#f46d43',
  '#fdae61',
  '#fee090',
  '#ffffbf',
  '#e0f3f8',
  '#abd9e9',
  '#74add1',
  '#4575b4',
  '#313695'
];








var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
  months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
  colors = ['#2C7BB6', '#00A6CA','#00CCBC','#90EB9D','#FFFF8C','#F9D057','#F29E2E','#E76818','#D7191C'],
  margin = {top: 100,right: 20,bottom: 100,left: 60};

var tooltip = d3.select('body').append('div')
  .attr('id', 'tooltip');

var x = d3.scaleTime()
  .range([0, width - 60]);

var y = d3.scaleLinear()
  .range([height - 150, 0]);

  
var svgContainer =  d3.select('.dataVisContainer')
  .append('svg')
  .attr('width', width + 75)
  .attr('height', height + 75);
  
  d3.json(dataURL).then((data) => {
    
    // Subtitle
    svgContainer.append("text")
    .attr("x", (width / 2))
    .attr("y", 42)
    .attr("text-anchor", "middle")
    .attr('id', 'description')
    .style("font-size", "1.3em")
    .html(`${data.monthlyVariance[0].year} - ${data.monthlyVariance[data.monthlyVariance.length-1].year}: base temperature ${data.baseTemperature}&#8451;`);
    
    var date = (year) => new Date(Date.parse(year));
    
    x.domain([date(data.monthlyVariance[0].year), date(data.monthlyVariance[data.monthlyVariance.length - 1].year)]);
    y.domain([0,11]);
    
    var xTicks = x.ticks().concat(new Date(data.monthlyVariance[data.monthlyVariance.length - 1].year, 0));
    var yTicks = y.ticks();
    
    svgContainer.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(58, 75)`)
      .call(d3.axisLeft(y).tickValues(yTicks))
      .selectAll('text')
      .data(months)
      .attr('class', 'months')
      .attr('x', -10)
      .attr('text-anchor','end')
      .text((d, i) => months[11 - i]);
      
    svgContainer.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(60,${height - 60})`)
      .call(d3.axisBottom(x).tickValues(xTicks));
  
    var colorScale = d3.scaleQuantize()
      .domain([d3.min(data.monthlyVariance, (d) => d.variance), d3.max(data.monthlyVariance, (d) => d.variance)])
      .range(colors);
  
    svgContainer.selectAll('.bar')
      .data(data.monthlyVariance)
      .enter().append('rect')
      .attr('class','cell')
      .attr('data-month', (d) => d.month - 1)
      .attr('data-year', (d) => d.year)
      .attr('data-temp', (d) => d.variance)
      .attr('x', (d) => x(new Date(d.year, 0)))
      .attr('width', ((width / data.monthlyVariance.length) + 40) / 12)
      .attr('y', (d) => y(11 - d.month))
      .attr('height', (height - 150) / 12)
      .attr('transform', 'translate(60, 28)')
      .attr('fill', (d) => colorScale(d.variance))
      .on('mouseover', (d) => {
        tooltip.attr('data-year', d.year)
        tooltip.transition()
          .duration(100)		
          .style('opacity', .9);
        tooltip.text(`${months[d.month - 1]} ${d.year} ${d.variance.toFixed(3)}°C`)
          .style('left', `${d3.event.pageX - 55}px`)	
          .style('top', `${d3.event.pageY - 40}px`);
      })
      .on('mouseout', () => {		
        tooltip.transition()		
        .duration(400)		
        .style('opacity', 0);	
      });
  }
);

var gradientScale = d3.scaleLinear()
  .range(colors);

var linearGradient = svgContainer.append('linearGradient')
  .attr('id', 'linear-gradient');  

linearGradient.selectAll('stop') 
  .data(gradientScale.range())                  
  .enter().append('stop')
  .attr('offset', (d,i) => i/(gradientScale.range().length - 1))
  .attr('stop-color', (d) => d);

svgContainer.append('rect')
  .attr('width', 300)
  .attr('height', 20)
  .attr('id', 'legend')
  .style('fill', 'url(#linear-gradient)')
  .attr('transform', `translate(${(width / 2) - 150},${height})`)
  .selectAll('rect')
  .data(gradientScale.range())
  .enter().append('rect')
  .attr('fill', (d) => d);

svgContainer.append('g')
  .selectAll('text')
  .data(Array.from(Array(13).keys()))
  .enter().append('text')
  .attr('class','temperatures')
  .attr('x', (d) => `${((width / 2) - 150) + (Math.ceil(300 / 13) * d)}`)
  .attr('y', height - 5)
  .text((d) => `${d - 6}`);
