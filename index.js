var date
var hour
const data = d3.csv('data/nov_2019.csv')
let dayData = data
let chartCount = 0
//this function gets the date from the filter box, the date is in the format 2012-12-01
//Year, Month, Day
function filter_data() {

  date = document.getElementById("date").value;
  hour = document.getElementById("hour").value;
  
  filterChange(date, hour)
  //will probably need to clear data?
  console.log(date)
  console.log(hour)
}

//when window loads, js gets the default filter values
window.onload = function()
{
  filter_data();
}

let generateTooltipChart = (object, date) => {
  data.then(dataset => {
    console.log("hi")
    let dimensions = {
      width: window.screen.availWidth / 6,
      height: window.screen.availHeight / 6, 
      margin: {
       top: 10, 
       bottom: 10,
       right: 10,
       left: 40 
      }
    }
    let sensorId = object.points[0].source.sensor_id
    let sensorData = dataset.filter(p => (+p.sensor_id == +sensorId) && (+p.mdate == +date.split('-')[2]) && (+p.date_time.split('/')[0] == +date.split('-')[1]))
    let svgId = chartCount === 1 ? "#barchart" : "#barchart2"
    let svg = d3.select(svgId)
      .style('width', dimensions.width + 10)
      .style('height', dimensions.height + 10)
    let xAccessor = d => +d.time
    let hours = [... new Set(sensorData.map(xAccessor))]
    let xScale = d3.scaleBand()
      .domain(hours.sort((a,b) => a - b))
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.1)
    
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(sensorData, d => +d.hourly_counts.replace(/,/g,''))])
      .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
    
    let barColor = d3.scaleOrdinal()
      .domain(hours)
      .range(d3.schemeDark2)
    
    let bars = svg.selectAll('rect')
      .data(sensorData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(+d.time))
      .attr('y', d => yScale(+d.hourly_counts.replace(/,/g,'')))
      .attr('width', xScale.bandwidth())
      .attr('height', d => dimensions.height - dimensions.margin.bottom - yScale(+d.hourly_counts.replace(/,/g,'')))
      .attr('fill', "steelblue")

    let xAxisgen = d3.axisBottom().scale(xScale)
    let yAxisgen = d3.axisLeft().scale(yScale)

    let xAxis = svg.append('g')
      .call(xAxisgen)
      .style('transform', `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
      .append('text')
      .attr('x', dimensions.width)
      .attr('y', dimensions.margin.bottom + 15)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .attr('fill', 'black')
      .text('Hour of the Day (24h Format)')
    let yAxis = svg.append('g')
      .call(yAxisgen)
      .style('transform', `translateX(${dimensions.margin.left}px)`)
      .append('text')
      // .attr('transform', 'rotate(-90)')
      .attr('x', dimensions.margin.left + dimensions.margin.right)
      .attr('y', 0)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .attr('fill', 'black')
      .text('# of Pedestrians')
  })   
}
console.log(dayData)

function filterChange(date, hour) {
  dayData = data.then((dataset) => dataset.filter(d => {
    return (+d.date_time.split('/')[0] == +date.split('-')[1]) 
    && (+d.date_time.split('/')[1] == +date.split('-')[2]) 
  }))
  console.log(dayData)
  renderLayer()
}
const {DeckGL, HexagonLayer} = deck;



let colorScale = d3.scaleLinear()
  .domain([0, 300])
  .range(d3.schemeCategory10)
// const COLOR_RANGE = [
//   [1, 152, 189],
//   [73, 227, 206],
//   [216, 254, 181],
//   [254, 237, 177],
//   [254, 173, 84],
//   [209, 55, 78]
// ];
const deckgl = new DeckGL({
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: {
    longitude: 144.9631,
    latitude: -37.8136,
    zoom: 15,
    minZoom: 5,
    maxZoom: 20,
    pitch: 0
  },
  controller: true
});




// let colorScale = d3.scaleLinear()
//   .domain([0, 300])
//   .range(d3.schemeCategory10)
// const COLOR_RANGE = [
//   [1, 152, 189],
//   [73, 227, 206],
//   [216, 254, 181],
//   [254, 237, 177],
//   [254, 173, 84],
//   [209, 55, 78]
// ];
renderLayer()

function renderLayer () {
  const hexLayer = new HexagonLayer({
    data: dayData,
    id: 'melbourne-pedestrian-density',
    pickable: true,
    getColorValue: d => {
      return +d[0].hourly_counts.replace(/,/g,'')
    },

    getElevationValue: d => {
      // console.log(d)
      // console.log(d[0].hourly_counts.replace(/,/g,''))
      return +d[0].hourly_counts.replace(/,/g,'')
    },
    extruded: false,
    autoHighlight: true,
    getPosition: (d, i) => {
      if (+d.time == +hour && +d.mdate == +date.split('-')[2] ) {
      // console.log(d.time)
        return [+d.longitude, +d.latitude]
      }
      else return []
    },
    opacity: 1,
    radius: 50,
    coverage: 1,
    upperPercentile: 90,
    updateTriggers: {
      getPosition: date,
      getPosition: hour,
      getElevationValue: date, 
      getElevationValue: hour,
      getColorValue: date,
      getColorValue: hour
      
    },
    onClick: (({object, x, y}) => {
      if (chartCount === 0)
      {
        chartCount = 1
        const el = document.getElementById('tooltip')
        const availHeight = window.screen.availHeight
        const availWidth = window.screen.availWidth
        if (object) {
          // console.log(object)
          el.innerHTML = `<div>
                            <h2>${object.points[0].source.sensor_description} <br/>
                                ${object.position.join(', ')} <br/>
                                ${object.points[0].source.date_time} <br/>
                                Hourly Count for ${object.points[0].source.time}:00: ${object.points[0].source.hourly_counts} Pedestrians
                            </h2> 
                            <svg id="barchart"></svg>
                          </div>`
          el.style.display = 'block'
          el.style.opacity = 0.9
          // el.style.width = availWidth / 6 + 10
          // el.style.left = (availWidth - (availWidth / 2)) + 'px'
          // el.style.top = (availHeight - (availHeight / 2)) + 'px'
  
          generateTooltipChart(object, date)
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
      }
      else if (chartCount === 1) 
      {
        chartCount = 2
        const el = document.getElementById('tooltip2')
        const availHeight = window.screen.availHeight
        const availWidth = window.screen.availWidth
        if (object) {
          // console.log(object)
          el.innerHTML = `<div>
                            <h2>${object.points[0].source.sensor_description} <br/>
                                ${object.position.join(', ')} <br/>
                                ${object.points[0].source.date_time} <br/>
                                Hourly Count for ${object.points[0].source.time}:00: ${object.points[0].source.hourly_counts} Pedestrians
                            </h2> 
                            <svg id="barchart2"></svg>
                          </div>`
          // el.style.display = 'float'
          // el.style.position = 'absolute'
          el.style.display = 'block'
          el.style.opacity = 0.9
          // el.style.width = availWidth / 6 + 10
          // el.style.left = (availWidth - (availWidth / 2)) + 'px'
          // el.style.top = ((availHeight / 6) + 10) + 'px'
  
          generateTooltipChart(object, date)
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
      }
      else if (chartCount === 2)
      {
        chartCount = 1
        const el = document.getElementById('tooltip')
        const availHeight = window.screen.availHeight
        const availWidth = window.screen.availWidth
        if (object) {
          // console.log(object)
          el.innerHTML = `<div>
                            <h2>${object.points[0].source.sensor_description} <br/>
                                ${object.position.join(', ')} <br/>
                                ${object.points[0].source.date_time} <br/>
                                Hourly Count for ${object.points[0].source.time}:00: ${object.points[0].source.hourly_counts} Pedestrians
                            </h2> 
                            <svg id="barchart"></svg>
                          </div>`
          // el.style.display = 'block'
          el.style.display = 'block'
          el.style.opacity = 0.9
          // el.style.width = availWidth / 6 + 10
          // el.style.left = (availWidth - (availWidth / 2)) + 'px'
          // el.style.top = (availHeight - (availHeight / 2)) + 'px'
  
          generateTooltipChart(object, date)
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
        const el2 = document.getElementById('tooltip2')
        el2.style.opacity = 0.0
        el2.innerHTML = `<div></div>`
      }
    })
  })

  deckgl.setProps({
    layers: [hexLayer]
  })
  console.log(deck)
}

