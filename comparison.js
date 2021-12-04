var date
var startHour
let endHour
const extreme_weather_data = d3.csv('data/Nov_21_2016_extreme_weather.csv')
const normal_day_data = d3.csv('data/may_2nd_2019.csv')
let yMax
let selectedItems = [null]
const SELECT_COLOR = {
  rgb: [172, 114, 172],
  hex: "#ac72ac"
}
const delTooltip = () => {
  const tooltip = document.getElementById('tooltips')
  tooltip.parentNode.style.opacity = 0.0
  tooltip.parentNode.removeChild(tooltip)
}


function filter_data() {

  startHour = document.getElementById("hour1").value;
  endHour = document.getElementById('hour2').value

  renderLayer()
  console.log(startHour, endHour)
}
const createCharts = (sensorId) => {
  let extremeDayMax 
  let normalDayMax
  extreme_weather_data.then(data => {
    normal_day_data.then(dataset => {
      extremeDayMax = d3.max(data.filter(p => (+p.sensor_id == +sensorId)),  d => +d.hourly_counts.replace(/,/g,''))
      normalDayMax = d3.max(dataset.filter(p => (+p.sensor_id == +sensorId)),  d => +d.hourly_counts.replace(/,/g,''))
      console.log(extremeDayMax, normalDayMax)
      if (extremeDayMax && !normalDayMax)
        yMax = extremeDayMax
      else if (!extremeDayMax && normalDayMax)
        yMax = normalDayMax
      else
        yMax = extremeDayMax > normalDayMax ? extremeDayMax : normalDayMax
      extremeTooltipChart(sensorId)
      normalTooltipChart(sensorId)
    })
  })
  
}
//when window loads, js gets the default filter values
window.onload = function()
{
  filter_data();
}

let extremeTooltipChart = (sensorId) => {
  extreme_weather_data.then(dataset => {
    let dimensions = {
      width: document.documentElement.clientWidth / 3,
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
      .style('width', dimensions.width + 10)
      .style('height', dimensions.height + 10)
    let xAccessor = d => +d.time
    let hours = [... new Set(sensorData.map(xAccessor))]
    let xScale = d3.scaleBand()
      .domain(hours.sort((a,b) => a - b))
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.1)
    
    let yScale = d3.scaleLinear()
      .domain([0, yMax])
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
      .attr('fill', "#F59B00")
      .attr('stroke-width', 2)
      .attr('stroke', SELECT_COLOR.hex)


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

let normalTooltipChart = (sensorId) => {
  normal_day_data.then(dataset => {
    let dimensions = {
      width: document.documentElement.clientWidth / 3,
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
      .domain([0, yMax])
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
      .attr('stroke-width', 2)
      .attr('stroke', SELECT_COLOR.hex)

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

const {DeckGL, HexagonLayer, ColumnLayer, ScatterplotLayer}  = deck;

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
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Count From ${startHour}:00 to ${endHour}:00 : ${object.elevationValue} Pedestrians`
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
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Count From ${startHour}:00 to ${endHour}:00 : ${object.elevationValue} Pedestrians`
  },
  controller: true
});


renderLayer()

function renderLayer () {
  const extremeWeatherLayers = [
    new HexagonLayer({
      data: extreme_weather_data,
      id: 'melbourne-pedestrian-density',
      pickable: true,
      getColorValue: d => {
        return +d[0].hourly_counts.replace(/,/g,'')
      },

      getElevationValue: d => {
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
        return [+d.longitude, +d.latitude]
        }
        else return []
      },
      opacity: 1,
      radius: 50,
      coverage: 1,
      upperPercentile: 90,
      updateTriggers: {
        getPosition: startHour,
        getPosition: endHour,
        getElevationValue: startHour,
        getElevationValue: endHour,
        getColorValue: startHour,
        getColorValue: endHour
      },
      onClick: (({object, x, y}) => {
        selectedItems[0] = object
        renderLayer()
        const el = document.getElementById('charts')
        if (object) {
          el.style.height = document.documentElement.clientHeight / 5
          el.innerHTML = `<div id="tooltips">
                            <div id="topTooltip">
                              <h2>Extreme Day Clicked</h2> 
                              <button class="delete" onclick="delTooltip()"></button>
                            </div>
                          
                            <h2>
                                ${object.points[0].source.sensor_description} <br/>
                                ${object.position.join(', ')} <br/>
                            </h2> 
                            <strong>Extreme day for ${object.points[0].source.sensor_description}</strong>
                            <br>
                            <svg id="barchart2"></svg>
                            <br>
                            <strong>Normal day for ${object.points[0].source.sensor_description}</strong>
                            <br>
                            <svg id="barchart"></svg>
                            <br>
                          </div>`
          el.style.width = document.documentElement.clientWidth / 3
          el.style.opacity = 0.9
          createCharts(object.points[0].source.sensor_id)
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
      })
    }),
    selectedItems[0] ? new ScatterplotLayer({
      id: 'normal-circle',
      data: [{ coordinates: selectedItems[0].position }],
      getRadius: 30,
      getPosition: d => {
        console.log(d)
        return d.coordinates},
      getFillColor: SELECT_COLOR.rgb,
      updateTriggers: {
        selectedItems
      }
    }): null,
  ]

  deckgl.setProps({
    layers: [extremeWeatherLayers]
  })

  const normalWeatherLayers =[
    new HexagonLayer({
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
        selectedItems[0] = object
        renderLayer()
        const el = document.getElementById('charts')
        if (object) {
          // console.log(object)
          el.innerHTML = `<div id="tooltips">
                            <div id="topTooltip">
                              <h2>Normal Day Clicked</h2> 
                              <button class="delete" onclick="delTooltip()"></button>
                            </div>
                          
                            <h2>
                                ${object.points[0].source.sensor_description} <br/>
                                ${object.position.join(', ')} <br/>
                            </h2> 
                            <strong>Extreme day for ${object.points[0].source.sensor_description}</strong>
                            <br>
                            <svg id="barchart2"></svg>
                            <br>
                            <strong>Normal day for ${object.points[0].source.sensor_description}</strong>
                            <br>
                            <svg id="barchart"></svg>
                            <br>
                          </div>`
          // el.style.display = 'block'
          el.style.opacity = 0.9
          // el.style.left = x + 'px'
          // el.style.top = y/3 + 'px'

          createCharts(object.points[0].source.sensor_id)
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
      })
    }),
    selectedItems[0] ? new ScatterplotLayer({
      id: 'normal-circle',
      data: [{ coordinates: selectedItems[0].position }],
      getRadius: 30,
      getPosition: d => {
        console.log(d)
        return d.coordinates},
      getFillColor: SELECT_COLOR.rgb,
      updateTriggers: {
        selectedItems
      }
    }): null,
  ]  


  deckgl2.setProps({
    layers: [normalWeatherLayers]
  })
}


  

