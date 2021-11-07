var date
var hour
const data = d3.csv('data/2019_pedestrian.csv')
let dayData = data
//this function gets the date from the filter box, the date is in the format 2012-12-01
//Year, Month, Day
function filter_data() {

  date = document.getElementById("date").value;
  hour = document.getElementById("hour").value;
  dayData = data.then((dataset) => dataset.filter(d => {
    // const dDate = d.date_time.split('/')
    // const dateSplit = date.split('-')
    (d.date_time.split('/')[0] == date.split('-')[1]) 
    && (+d.date_time.split('/')[1] == +date.split('-')[2]) 
  }))
  // renderLayer()
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
  console.log(object)
  let sensorId = object.points[0].source.sensor_id
  console.log(date)
  let sensorData = object.points.filter(p => p.source.mdate == date.split('-')[2])
  console.log(sensorData)

  let svg = d3.select("barchart")
    .style('width', 500)
    .style('height', 500)
  let xAccessor = d => +d.time
  let hours = [... new Set(sensorData.map(xAccessor))]
  console.log(hours)
  let xScale = d3.scaleBand()
    .domain(hours)
    .range([0, 500])
    .padding(0.1)
  
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(sensorData, d => +d.source.hourly_counts)])
    .range([500, 0])
  
  let barColor = d3.scaleOrdinal()
    .domain(hours)
    .range(d3.schemeDark2)
  
  let bars = svg.selectAll('rect')
    .data(sensorData)
    .enter()
    .append('rect')
    .attr('x', d => xScale(+d.source.time))
    .attr('y', d => yScale(+d.source.hourly_counts))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(+d.source.hourly_counts))
    .attr('fill', d => barColor(+d.source.time))

  let xAxisgen = d3.axisBottom().scale(xScale)
  let yAxisgen = d3.axisLeft().scale(yScale)

  let xAxis = svg.append('g')
    .call(xAxisgen)
  let yAxis = svg.append('g')
    .call(yAxisgen)
  }
console.log(dayData)
// console.log(data)
const {DeckGL, HexagonLayer} = deck;

// renderLayer()
// console.log(data)

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
    zoom: 12,
    minZoom: 5,
    maxZoom: 20,
    pitch: 55
  },
  // getTooltip: ({object}) => object && {
  //   // console.log(object)
  //   html: `<div>
  //     <h2>${object.points[0].source.sensor_description}
  //         ${object.position.join(', ')} 
  //         Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians
  //     </h2> 
  //     <svg id="barchart"></svg>
  //   </div>`
    //  <script ></script>${generateTooltipChart(object)}
    // return object && 
// },
  controller: true
});


// const data = d3.csv('data/2019_pedestrian.csv')//.get((dataset) => dataset)
// console.log(data)

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
    extruded: true,
    getPosition: (d, i) => {
      if (+d.time == hour ) {
      // console.log(d.time)
      return [+d.longitude, +d.latitude]
      }
      else return []
    },
    opacity: 1,
    radius: 50,
    coverage: 1,
    upperPercentile: 90,
    onHover: (({object, x, y}) => {
      const el = document.getElementById('tooltip')
      if (object) {
        el.innerHTML = `<div>
                          <h2>${object.points[0].source.sensor_description} <br/>
                              ${object.position.join(', ')} <br/>
                              Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians
                          </h2> 
                          <svg id="barchart"></svg>
                        </div>`
        el.style.display = 'block'
        el.style.opacity = 0.9
        el.style.left = x + 'px'
        el.style.top = y + 'px'

        generateTooltipChart(object, date)
      }
      else {
        el.style.opacity = 0.0
      }
    })
  })

  deckgl.setProps({
    layers: [hexLayer]
  })
  console.log(deck)
}

