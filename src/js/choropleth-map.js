const BASE_URL = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/"
const COUNTY_GEOMETRY = BASE_URL + "counties.json";
const EDUCATION = BASE_URL + "for_user_education.json";
const color = ['#f1eef6','#bdc9e1','#74a9cf','#0570b0'];

const init = async () => {
  const mapDataRequest = await fetch(COUNTY_GEOMETRY, {});
  const mapData = await mapDataRequest.json();

  const eduDataRequest = await fetch(EDUCATION, {});
  const eduData = await eduDataRequest.json();

  render(mapData, eduData);
}

const render = (mapData, eduData) => {
  const place = datum => eduData.filter(e => e.fips === datum.id)[0];
  
  const lowestPercent = d3.min(eduData, e => e.bachelorsOrHigher);
  const highestPercent = d3.max(eduData, e => e.bachelorsOrHigher);
  
  const colorScale = d3.scaleLinear()
    .domain([lowestPercent, highestPercent])
    .range([0, color.length]);
   
  // Title element
  const title = d3.select('.dataVisContainer')
    .append('div')
    .attr('id', 'title')
    .text('US Academic Achievement Choropleth Map');
  
  const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('padding', '1em')
    .style('left', 'calc(50vw - 100px)')
    .style('opacity', 0)
    .style('background-color', 'rgba(255,255,255,0.8)');
  
  const mapContainer = d3.select('.dataVisContainer')
    .append('div')
    .style('justify-content', 'center')
    .attr('id', 'mapContainer')
    .append('div')
    .style('width', '980px')
    .style('height', '600px');
  
  const svgContainer = mapContainer.append('svg')
    .attr('id', 'map')
    .attr('width', '980px')
    .attr('height', '600px');

  svgContainer.append("text")
    .attr("x", (980 / 1.7))
    .attr("y", 42)
    .attr("text-anchor", "middle")
    .attr('id', 'description')
    .style("font-size", "1.3em")
    .text('Percentage of 25+ year olds with Bachelor\'s degree or higher');

  
  const counties = svgContainer.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(mapData, mapData.objects.counties).features)
    .enter()
    .append("path")
    .attr('class', 'county')
    .attr('data-fips', d => d.id)
    .attr('data-education', d => place(d).bachelorsOrHigher)
    .attr("fill", d => {
      let colorCode = Math.round(colorScale(place(d).bachelorsOrHigher));
      return color[colorCode];
    })
    .attr('stroke', '#000')
    .attr('stroke-width', '.1px')
    .attr("d", d3.geoPath())
    .on('mouseover', d => {
      tooltip
        .attr('data-education', place(d).bachelorsOrHigher)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('left', (d3.event.pageX + 20)+'px')
        .style('top', (d3.event.pageY - 20)+'px')
      tooltip.html(
        place(d).area_name + ", " 
        + place(d).state + "<br>"
        + place(d).bachelorsOrHigher
        + "% of adults with Bachelor's degree or higher"
      );
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });
  
  const legend = svgContainer.append('g')
    .attr('id', 'legend');
  
  const boxWidth = 35;
  
  for (let i = 0; i < color.length; i++) {
    legend.append('rect')
      .attr('x', 540+(i*boxWidth)+'px')
      .attr('y', '535px')
      .attr('width', boxWidth+'px')
      .attr('height', boxWidth+'px')
      .attr('fill', color[i])
      .attr('stroke', '#000')
      .attr('stroke-width', '1px');
    legend.append('text')
      .attr('x', 540+(i*boxWidth)+'px')
      .attr('y', '580px')
      .style('font-size', '10px')
      .text((lowestPercent + (highestPercent - lowestPercent) / color.length * i).toFixed(1)+"%");
  }
};

init();