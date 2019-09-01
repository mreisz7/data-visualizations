// Data URL
var dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

// Title element
var title = d3.select('.dataVisContainer')
    .append('div')
    .attr('id', 'title')
    .text('United States GDP');

// Size variables
var titleHeight = document.getElementById('title').clientHeight;
var width = document.getElementById('container').clientWidth - 150;
var height = document.getElementById('container').clientHeight - titleHeight - 100;

// Tooltip element
var tooltip = d3.select('.dataVisContainer')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

// Overlay element
var overlay = d3.select('.dataVisContainer')
    .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

// SVG container
var svgContainer =  d3.select('.dataVisContainer')
    .append('svg')
    .attr('width', width + 75)
    .attr('height', height + 75);

// legend
svgContainer.append('text')
    .attr('x', -250)
    .attr('y', 100)
    .attr('transform', 'rotate(-90)')
    .text('Gross Domestic Product (GDP)');

// additional information
svgContainer.append('text')
    .attr('x', width / 2)
    .attr('y', height + 50)
    .text('Find out more at http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');

// Build the chart
d3.json(dataURL).then((data) => {

    // Calculate the bar width based on the total width and number of elements
    var barWidth = width / data.data.length;
  
    // get an array of year-quarters
    var quarterYears = data.data.map((item) => {
        var quarter;
        switch(item[0].substring(5, 7)) {
            case '01':
                quarter = 'Q1';
                break;
            case '04':
                quarter = 'Q2';
                break;
            case '07':
                quarter = 'Q3';
                break;
            case '10':
                quarter = 'Q4';
                break;
        }
        return item[0].substring(0, 4) + ' - ' + quarter
    });
  
    var yearsDate = data.data.map((item) => new Date(item[0]));

    var xMax = new Date(d3.max(yearsDate));

    xMax.setMonth(xMax.getMonth() + 3);

    // Define x axis (time)
    var xScale = d3.scaleTime()
        .domain([d3.min(yearsDate), xMax])
        .range([0, width]);
  
    var xAxis = d3.axisBottom()
        .scale(xScale);
  
    svgContainer.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(75, ${height + 5})`);
  
    var GDP = data.data.map((item) => item[1]);
  
    var scaledGDP = [];
  
    var gdpMax = d3.max(GDP);
  
    var linearScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([0, height]);
  
    scaledGDP = GDP.map((item) => linearScale(item));
  
    // Define y axis (GDP)
    var yAxisScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([height, 0]);
  
    var yAxis = d3.axisLeft(yAxisScale)
    
    svgContainer.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(75, 5)');
    
    // Draw actual bar chart values
    d3.select('svg').selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('data-date', (d, i) => data.data[i][0])
        .attr('data-gdp', (d, i) => data.data[i][1])
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(yearsDate[i]))
        .attr('y', (d, i) => height - d)
        .attr('width', barWidth)
        .attr('height', (d) => d)
        .style('fill', '#79c142')
        .attr('transform', 'translate(75, 5)')
        // define the mouseover effects
        .on('mouseover', (d, i) => {
            overlay.transition()
                .duration(0)
                .style('height', d + 'px')
                .style('width', barWidth + 'px')
                .style('opacity', 1)
                .style('left', (i * barWidth) + 75 + 'px')
                .style('top', (height - d) + 'px')
                .style('transform', 'translateY(54px)');
            tooltip.transition()
                .duration(100)
                .style('opacity', 1);
            tooltip.html(`<h4>${quarterYears[i]}</h4>$${GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion`)
                .attr('data-date', data.data[i][0])
                .style('left', (i * barWidth) + 30 + 'px')
                .style('top', (height - (d * .5)) + 'px')
                .style('transform', `translateX(${(d < width * .25) ? '60' : '-130'}px)`);
            })
        .on('mouseout', (d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0);
            overlay.transition()
                .duration(200)
                .style('opacity', 0);
            });
});
