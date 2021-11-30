var date
var startHour
let endHour
const extreme_weather_data = d3.csv('data/Nov_21_2016_extreme_weather.csv')
const normal_day_data = d3.csv('data/may_2nd_2019.csv')
console.log(normal_day_data)




function filter_data() {

  startHour = document.getElementById("hour1").value;
  endHour = document.getElementById('hour2').value
  //date = document.getElementById("date").value;

  renderLayer()
  console.log(startHour, endHour)
}

//when window loads, js gets the default filter values
window.onload = function()
{
  filter_data();
}

let extremeTooltipChart = (sensorId, date) => {
  extreme_weather_data.then(dataset => {
    let dimensions = {
      width: document.documentElement.clientWidth / 4,
      height: document.documentElement.clientHeight / 5, 
      margin: {
       top: 10, 
       bottom: 10,
       right: 10,
       left: 40 
      }
    }
    let sensorData = dataset.filter(p => (+p.sensor_id == +sensorId) )

    let svg = d3.select("#barchart2")
      .style('width', 600)
      .style('height', 700)
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

let normalTooltipChart = (sensorId, date) => {
  normal_day_data.then(dataset => {
    let dimensions = {
      width: document.documentElement.clientWidth / 4,
      height: document.documentElement.clientHeight / 5, 
      margin: {
       top: 10, 
       bottom: 10,
       right: 10,
       left: 40 
      }
    }
    let sensorData = dataset.filter(p => (+p.sensor_id == +sensorId) )

    let svg = d3.select("#barchart")
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

const {DeckGL, HexagonLayer, ColumnLayer}  = deck;

let colorScale = d3.scaleLinear()
  .domain([0, 300])
  .range(d3.schemeCategory10)



const deckgl = new DeckGL({
  container: "map1",
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: {
    longitude: 144.9631,
    latitude: -37.8136,
    zoom: 15,
    minZoom: 5,
    maxZoom: 20,
    pitch: 0,
  },

  getTooltip: ({object}) => {
    //console.log(object)
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians`
},
  controller: true
});

const deckgl2 = new DeckGL({
  container: "map2",
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: {
    longitude: 144.9631,
    latitude: -37.8136,
    zoom: 15,
    minZoom: 5,
    maxZoom: 20,
    pitch: 0,
  },
  getTooltip: ({object}) => {
    //console.log(object)
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians`
  },
  controller: true
});


renderLayer()

function renderLayer () {
  const hexLayer_weather = new HexagonLayer({
    data: extreme_weather_data,
    id: 'melbourne-pedestrian-density',
    pickable: true,
    getColorValue: d => {
      return +d[0].hourly_counts.replace(/,/g,'')
    },

    getElevationValue: d => {
      // console.log(d)
      // console.log(d[0].hourly_counts.replace(/,/g,''))
      return d.reduce(
        (accumulator, currentValue) => {
          return currentValue ? accumulator + (+currentValue.hourly_counts.replace(/,/g,'')) : accumulator
        }, 0
      )
    },
    extruded: false,
    autoHighlight: true,
    getPosition: (d, i) => {
      if (+d.time >= startHour && +d.time < endHour ) {
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
      //getPosition: date,
      getPosition: startHour,
      getPosition: endHour,
      //getElevationValue: date, 
      getElevationValue: startHour,
      getElevationValue: endHour,
      //getColorValue: date,
      getColorValue: startHour,
      getColorValue: endHour
    },
    onClick: (({object, x, y}) => {
      const el = document.getElementById('tooltip')
      if (object) {
        // console.log(object)
        el.innerHTML = `<div>
                          <h2>Normal Day <br/>
                              ${object.points[0].source.sensor_description} <br/>
                              ${object.position.join(', ')} <br/>
                              ${object.points[0].source.date_time} <br/>
                              Hourly Count for ${object.points[0].source.time}:00: ${object.points[0].source.hourly_counts} Pedestrians
                          </h2> 
                          <strong>Normal day for ${object.points[0].source.sensor_description}</strong>
                          <br>
                          <svg id="barchart"></svg>
                          <br>
                          <strong>Extreme day for ${object.points[0].source.sensor_description}</strong>
                          <br>
                          <svg id="barchart2"></svg>
                        </div>`
        // el.style.display = 'block'
        el.style.opacity = 0.9
        // el.style.left = x + 'px'
        // el.style.top = y/3 + 'px'

        normalTooltipChart(object.points[0].source.sensor_id, date)
        extremeTooltipChart(object.points[0].source.sensor_id, date)
      }
      else {
        el.style.opacity = 0.0
        el.innerHTML = `<div></div>`
      }
    })
  })

  

  deckgl.setProps({
    layers: [hexLayer_weather]
  })

  const hexLayer_normal= new HexagonLayer({
    data: normal_day_data,
    id: 'melbourne-pedestrian-density',
    pickable: true,
    getColorValue: d => {
      return d.reduce(
        (accumulator, currentValue) => {
          return currentValue ? accumulator + (+currentValue.hourly_counts.replace(/,/g,'')) : accumulator
        }, 0
      )
    },

    getElevationValue: d => {
      // console.log(d)
      // console.log(d[0].hourly_counts.replace(/,/g,''))
      return d.reduce(
        (accumulator, currentValue) => {
          return currentValue ? accumulator + (+currentValue.hourly_counts.replace(/,/g,'')) : accumulator
        }, 0
      )
    },
    extruded: false,
    autoHighlight: true,
    getPosition: (d, i) => {
      if ((+d.time >= +startHour && +d.time < +endHour)) {
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
      //getPosition: date,
      getPosition: startHour,
      getPosition: endHour,
      //getElevationValue: date, 
      getElevationValue: startHour,
      getElevationValue: endHour,
      //getColorValue: date,
      getColorValue: startHour,
      getColorValue: endHour
    },
    onClick: (({object, x, y}) => {
      const el = document.getElementById('tooltip')
      if (object) {
        // console.log(object)
        el.innerHTML = `<div>
                          <button></button>
                          <h2>Normal Day <br/>
                              ${object.points[0].source.sensor_description} <br/>
                              ${object.position.join(', ')} <br/>
                              ${object.points[0].source.date_time} <br/>
                              Hourly Count for ${object.points[0].source.time}:00: ${object.points[0].source.hourly_counts} Pedestrians
                          </h2> 
                          <br>
                          <strong>Normal day for ${object.points[0].source.sensor_description}</strong>
                          <br>
                          <svg id="barchart"></svg>
                          <br>
                          <strong>Extreme day for ${object.points[0].source.sensor_description}</strong>
                          <br>
                          <svg id="barchart2"></svg>
                        </div>`
        // el.style.display = 'block'
        el.style.opacity = 0.9
        // el.style.left = x + 'px'
        // el.style.top = y/3 + 'px'

        normalTooltipChart(object.points[0].source.sensor_id, date)
        extremeTooltipChart(object.points[0].source.sensor_id, date)
      }
      else {
        el.style.opacity = 0.0
        el.innerHTML = `<div></div>`
      }
    })
  })


  deckgl2.setProps({
    layers: [hexLayer_normal]
  })
}


  

