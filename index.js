var date
var startHour
let endHour
const data = d3.csv('data/nov_2019.csv')
let dayData = data
let chartCount = 0
let isSecond = false
let firstObject = null
let firstBars
let firstYScale
let firstYAxis
let firstYAxisGen
let firstSvg 
let selectedItems = [null, null]
let highlightedObjectIndex = -1

//this function gets the date from the filter box, the date is in the format 2012-12-01
//Year, Month, Day
const delTooltip = () => {
  const tooltip = document.getElementById('tooltips')
  tooltip.parentNode.style.opacity = 0.0;
  tooltip.parentNode.innerHTML= "<div></div>"
}

function filter_data() {

  date = document.getElementById("date").value;
  startHour = document.getElementById("hour1").value;
  endHour = document.getElementById("hour2").value
  filterChange(date, startHour, endHour)
  //will probably need to clear data?
  console.log(date)
  console.log(startHour, endHour)
}

//when window loads, js gets the default filter values
window.onload = function()
{
  filter_data();
}

let generateTooltipChart = (object, date) => {
  data.then(dataset => {
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
    let sensorId = object.points[0].source.sensor_id
    // let maxOfDay = d3.max(dataset.filter(p => (+p.mdate == +date.split('-')[2]) && (+p.date_time.split('/')[0] == +date.split('-')[1])), d => +d.hourly_counts.replace(/,/g,''))
    let sensorData = dataset.filter(p => (+p.sensor_id == +sensorId) && (+p.mdate == +date.split('-')[2]) && (+p.date_time.split('/')[0] == +date.split('-')[1]))
    let maxOfSensor = d3.max(sensorData,  d => +d.hourly_counts.replace(/,/g,''))
    let maxOfBothObject = maxOfSensor
    if (isSecond && firstObject)
    {
      let firstSensorData = dataset.filter((p => (+p.sensor_id == +firstObject.points[0].source.sensor_id) && (+p.mdate == +date.split('-')[2]) && (+p.date_time.split('/')[0] == +date.split('-')[1])))
      maxFirstObj = d3.max(firstSensorData, d => +d.hourly_counts.replace(/,/g,''))
      maxFirstObj > maxOfSensor ? maxOfBothObject = maxFirstObj : maxOfBothObject = maxOfSensor

      
    }
    let svgId = chartCount === 1 ? "#barchart" : "#barchart2"
    
    let svg = d3.select(svgId)
      .style('width', dimensions.width + 10)
      .style('height', dimensions.height + 30)
    
    let xAccessor = d => +d.time
    let hours = [... new Set(sensorData.map(xAccessor))]
    let xScale = d3.scaleBand()
      .domain(hours.sort((a,b) => a - b))
      .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
      .padding(0.1)
    
    let yScale = d3.scaleLinear()
      .domain([0, maxOfBothObject])
      .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
    
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
    if (chartCount === 1)
    {
      firstSvg = svg
      firstYAxisGen = yAxisgen
      firstYAxis = firstSvg.append('g').attr("class", "y axis")
      .call(firstYAxisGen)
      .style('transform', `translateX(${dimensions.margin.left}px)`)
      .append('text')
      .attr('x', dimensions.margin.left + dimensions.margin.right)
      .attr('y', 0)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .attr('fill', 'black')
      .text('# of Pedestrians')
    }
    else{
      let yAxis = svg.append('g')
      .call(yAxisgen)
      .style('transform', `translateX(${dimensions.margin.left}px)`)
      .append('text')
      .attr('x', dimensions.margin.left + dimensions.margin.right)
      .attr('y', 0)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .attr('fill', 'black')
      .text('# of Pedestrians')
    }
    
    if (!isSecond){
      firstBars = bars
      firstYScale = yScale
      // firstYAxisGen = yAxisgen
      // firstYAxis = yAxis
    }
    else {
      if (maxOfSensor > maxFirstObj)
      {
        console.log(maxOfSensor, maxFirstObj, maxOfBothObject)
        firstYScale.domain([0, maxOfBothObject])
        
        firstYAxisGen.scale(firstYScale)
       
        // firstYAxis.transition().duration(1500).call(firstYAxisGen)
        firstYAxis = firstSvg.selectAll("g.y.axis")
        firstYAxis.transition().duration(1500).call(firstYAxisGen)
        firstBars.transition().duration(1500)
                 .attr('y', d => firstYScale(+d.hourly_counts.replace(/,/g,'')))
                 .attr('height', d => dimensions.height - dimensions.margin.bottom - yScale(+d.hourly_counts.replace(/,/g,'')))
      }
    }

  })   
}
console.log(dayData)

function filterChange(date, startHour, endHour) {
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
    pitch: 0,
  },
  getTooltip: ({object}) => {
    //console.log(object)
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Count From ${startHour}:00 to ${endHour}:00 : ${object.elevationValue} Pedestrians`
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
    highlightColor: d => {
      if (selectedItems[0] && (d.id === selectedItems[0]?.points[0]?.source?.id)){
        return [152, 251, 152]
      } 
      if (selectedItems[1] && (d.id === selectedItems[1]?.points[1]?.source?.id)){ 
        return [135, 206, 250]
      }
    },
    highlightedObjectIndex: d => {
      if (selectedItems[0] && (d.id === selectedItems[0]?.points[0]?.source?.id)){
        return selectedItems[0].index
      } 
      if (selectedItems[1] && (d.id === selectedItems[1]?.points[1]?.source?.id)){ 
        return selectedItems[1].index
      }
    },
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
      if ((+d.time >= +startHour && +d.time < +endHour) && +d.mdate == +date.split('-')[2] ) {
        return [+d.longitude, +d.latitude]
      }
      else return []
    },
    opacity: 1,
    radius: 50,
    coverage: 1,
    upperPercentile: 90,
    transitions: {
      getPositions: 2000,
      getColors: 5000
    },
    updateTriggers: {
      getPosition: date,
      getPosition: startHour,
      getPosition: endHour,
      getElevationValue: date, 
      getElevationValue: startHour,
      getElevationValue: endHour,
      getColorValue: date,
      getColorValue: startHour,
      getColorValue: endHour,
      highlightedObjectIndex
      // getFillColor: selectedItems[0],
      // getFillColor: selectedItems[1]

      
    },
    onClick: (({object, x, y}) => {
      if (chartCount === 0)
      {
        const highlight = document.createElement("div")
        highlight.className = "box has-text-centered"
        highlight.style.width = '4%'
        highlight.style.height = '1%'
        highlight.style.position = 'absolute'
        highlight.style.background = 'white'
        highlight.style.display = 'block'
        highlight.style.opacity = 1
        highlight.style.left = x + 'px'
        highlight.style.top = y + 'px'
        const numberText = document.createTextNode('Clicked')
        highlight.appendChild(numberText)
        const charts = document.getElementById("charts")
        document.body.insertBefore(highlight, charts)
        highlightedObjectIndex = object.index
        console.log(highlightedObjectIndex)
        console.log(object)
        selectedItems[0] = object 
        console.log(selectedItems)
        chartCount = 1
        const el = document.getElementById('tooltip')
        const availHeight = window.screen.availHeight
        const availWidth = window.screen.availWidth
        if (object) {
          // console.log(object)
          // using elevation value for aggregation metrics
          el.innerHTML = `<div id="tooltips">
                            <div id="topTooltip">
                              <h2><strong>${object.points[0].source.sensor_description}</strong></h2> 
                              <button class="delete" onclick="delTooltip()"></button>
                            </div>
                            <h2>
                              ${object.position.join(', ')} <br/>
                              ${object.points[0].source.date_time} <br/>
                              Pedestrian Count from ${startHour}:00 to ${endHour}:00: <strong>${object.elevationValue}</strong> Pedestrians
                            </h2>  
                            <svg id="barchart"></svg>
                          </div>`
          el.style.display = 'block'
          el.style.opacity = 0.9
          firstObject = object;
          generateTooltipChart(object, date)

          
          
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
      }
      else if (chartCount === 1) 
      {
        highlightedObjectIndex = object.index
        selectedItems[1] = object
        chartCount = 2
        const highlight = document.createElement("div")
        highlight.className = "box has-text-centered"
        highlight.style.width = '4%'
        highlight.style.height = '1%'
        highlight.style.position = 'absolute'
        highlight.style.background = 'white'
        highlight.style.display = 'block'
        highlight.style.opacity = 1
        highlight.style.left = x + 'px'
        highlight.style.top = y + 'px'
        const numberText = document.createTextNode('Clicked')
        highlight.appendChild(numberText)
        const charts = document.getElementById("charts")
        document.body.insertBefore(highlight, charts)
        const el = document.getElementById('tooltip2')
        const availHeight = window.screen.availHeight
        const availWidth = window.screen.availWidth
        if (object) {
          // console.log(object)
          el.innerHTML = `<div id="tooltips">
                            <div id="topTooltip">
                              <h2><strong>${object.points[0].source.sensor_description}</strong></h2> 
                              <button class="delete" onclick="delTooltip()"></button>
                            </div>
                            <h2>
                              ${object.position.join(', ')} <br/>
                              ${object.points[0].source.date_time} <br/>
                              Pedestrian Count from ${startHour}:00 to ${endHour}:00: <strong>${object.elevationValue}</strong> Pedestrians
                            </h2> 
                            <svg id="barchart2"></svg>
                          </div>`
          el.style.display = 'block'
          el.style.opacity = 0.9
          isSecond = true
          console.log(isSecond)
          generateTooltipChart(object, date)
        }
        else {
          el.style.opacity = 0.0
          el.innerHTML = `<div></div>`
        }
      }
      else if (chartCount === 2)
      {
        highlightedObjectIndex = object.index
        selectedItems[0] = object
        selectedItems[1] = null
        const highlight = document.createElement("div")
        highlight.className = "box has-text-centered"
        highlight.style.width = '4%'
        highlight.style.height = '1%'
        highlight.style.position = 'absolute'
        highlight.style.background = 'white'
        highlight.style.display = 'block'
        highlight.style.opacity = 1
        highlight.style.left = x + 'px'
        highlight.style.top = y + 'px'
        const numberText = document.createTextNode('Clicked')
        highlight.appendChild(numberText)
        const charts = document.getElementById("charts")
        document.body.insertBefore(highlight, charts)
        chartCount = 1
        const el = document.getElementById('tooltip')
        const availHeight = window.screen.availHeight
        const availWidth = window.screen.availWidth
        if (object) {
          // console.log(object)
          el.innerHTML = `<div id="tooltips">
                            <div id="topTooltip">
                              <h2><strong>${object.points[0].source.sensor_description}</strong></h2> 
                              <button class="delete" onclick="delTooltip()"></button>
                            </div>
                            <h2>
                              ${object.position.join(', ')} <br/>
                              ${object.points[0].source.date_time} <br/>
                              Pedestrian Count from ${startHour}:00 to ${endHour}:00: <strong>${object.elevationValue}</strong> Pedestrians
                            </h2> 
                            <svg id="barchart"></svg>
                          </div>`
          el.style.display = 'block'
          el.style.opacity = 0.9
          isSecond = false
          firstObject = object
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


