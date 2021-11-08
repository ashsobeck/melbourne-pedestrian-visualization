// var date
// var hour
// const normal_day_data = d3.csv('data/one_day_2019.csv')



// function filter_data() {

//   hour = document.getElementById("hour").value;
//   //date = document.getElementById("date").value;

//   renderLayer()
//   console.log(hour)
// }

// //when window loads, js gets the default filter values
// window.onload = function()
// {
//   filter_data();
// }

// let generateTooltipChart = (object, date) => {
//   data.then(dataset => {
//     let dimensions = {
//       width: 600,
//       height: 600, 
//       margin: {
//        top: 10, 
//        bottom: 10,
//        right: 10,
//        left: 40 
//       }
//     }
//     let sensorId = object.points[0].source.sensor_id
//     let sensorData = dataset.filter(p => (+p.sensor_id == +sensorId) && (+p.mdate == +date.split('-')[2]) && (+p.date_time.split('/')[0] == +date.split('-')[1]))

//     let svg = d3.select("#barchart")
//       .style('width', 600)
//       .style('height', 700)
//     let xAccessor = d => +d.time
//     let hours = [... new Set(sensorData.map(xAccessor))]
//     let xScale = d3.scaleBand()
//       .domain(hours.sort((a,b) => a - b))
//       .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
//       .padding(0.1)
    
//     let yScale = d3.scaleLinear()
//       .domain([0, d3.max(sensorData, d => +d.hourly_counts.replace(/,/g,''))])
//       .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
    
//     let barColor = d3.scaleOrdinal()
//       .domain(hours)
//       .range(d3.schemeDark2)
    
//     let bars = svg.selectAll('rect')
//       .data(sensorData)
//       .enter()
//       .append('rect')
//       .attr('x', d => xScale(+d.time))
//       .attr('y', d => yScale(+d.hourly_counts.replace(/,/g,'')))
//       .attr('width', xScale.bandwidth())
//       .attr('height', d => dimensions.height - dimensions.margin.bottom - yScale(+d.hourly_counts.replace(/,/g,'')))
//       .attr('fill', d => barColor(+d.time))

//     let xAxisgen = d3.axisBottom().scale(xScale)
//     let yAxisgen = d3.axisLeft().scale(yScale)

//     let xAxis = svg.append('g')
//       .call(xAxisgen)
//       .style('transform', `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
//       .append('text')
//       .attr('x', dimensions.width)
//       .attr('y', dimensions.margin.bottom + 15)
//       .attr('dy', '.71em')
//       .style('text-anchor', 'end')
//       .attr('fill', 'black')
//       .text('Hour of the Day (24h Format)')
//     let yAxis = svg.append('g')
//       .call(yAxisgen)
//       .style('transform', `translateX(${dimensions.margin.left}px)`)
//       .append('text')
//       // .attr('transform', 'rotate(-90)')
//       .attr('x', dimensions.margin.left + dimensions.margin.right)
//       .attr('y', 0)
//       .attr('dy', '.71em')
//       .style('text-anchor', 'end')
//       .attr('fill', 'black')
//       .text('# of Pedestrians')
//   })   
// }

// const {DeckGL, HexagonLayer, ColumnLayer}  = deck;

// let colorScale = d3.scaleLinear()
//   .domain([0, 300])
//   .range(d3.schemeCategory10)



// const deckgl = new DeckGL({
//   container: "map2",
//   mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
//   initialViewState: {
//     longitude: 144.9631,
//     latitude: -37.8136,
//     zoom: 12,
//     minZoom: 5,
//     maxZoom: 20,
//     pitch: 55,
//   },

//   getTooltip: ({object}) => {
//     //console.log(object)
//     return object && `${object.points[0].source.sensor_description}
//     ${object.position.join(', ')} 
//     Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians`
// },
//   controller: true
// });




// renderLayer()

// function renderLayer () {
//   const hexLayer = new HexagonLayer({
//     data: normal_day_data,
//     id: 'melbourne-pedestrian-density',
//     pickable: true,
//     getColorValue: d => {
//       return +d[0].hourly_counts.replace(/,/g,'')
//     },

//     getElevationValue: d => {
//       // console.log(d)
//       // console.log(d[0].hourly_counts.replace(/,/g,''))
//       return +d[0].hourly_counts.replace(/,/g,'')
//     },
//     extruded: true,
//     getPosition: (d, i) => {
//       if (+d.time == hour ) {
//       // console.log(d.time)
//       return [+d.longitude, +d.latitude]
//       }
//       else return []
//     },
//     opacity: 1,
//     radius: 50,
//     coverage: 1,
//     upperPercentile: 90,
//     updateTriggers: {
//       //getPosition: date,
//       getPosition: hour,
//       //getElevationValue: date, 
//       getElevationValue: hour,
//       //getColorValue: date,
//       getColorValue: hour
//     },
//     // onHover: (({object, x, y}) => {
//     //   const el = document.getElementById('tooltip')
//     //   if (object) {
//     //     console.log(object)
//     //     el.innerHTML = `<div>
//     //                       <h2>${object.points[0].source.sensor_description} <br/>
//     //                           ${object.position.join(', ')} <br/>
//     //                           Hourly Count for ${object.points[0].source.time}00: ${object.points[0].source.hourly_counts} Pedestrians
//     //                       </h2> 
//     //                       <svg id="barchart"></svg>
//     //                     </div>`
//     //     el.style.display = 'block'
//     //     el.style.opacity = 0.9
//     //     el.style.left = x + 'px'
//     //     el.style.top = y/3 + 'px'

//     //     generateTooltipChart(object, date)
//     //   }
//     //   else {
//     //     el.style.opacity = 0.0
//     //   }
//     //})
//   })

//   // const columnLayer = new ColumnLayer({
//   //   data: normal_day_data,
//   //   id: 'melbourne-pedestrian-density',
//   //   pickable: true,
//   //   getColorValue: d => {
//   //     return +d[0].hourly_counts.replace(/,/g,'')
//   //   },

//   //   getElevationValue: d => {
//   //     // console.log(d)
//   //     // console.log(d[0].hourly_counts.replace(/,/g,''))
//   //     return +d[0].hourly_counts.replace(/,/g,'')
//   //   },
//   //   extruded: true,
//   //   getPosition: (d, i) => {
//   //     if (+d.time == hour ) {
//   //     // console.log(d.time)
//   //     return [+d.longitude, +d.latitude]
//   //     }
//   //     else return []
//   //   },
//   //   opacity: 1,
//   //   radius: 50,
//   //   coverage: 1,
//   //   upperPercentile: 90,
//   //   // onHover: (({object, x, y}) => {
//   //   //   const el = document.getElementById('tooltip')
//   //   //   if (object) {
//   //   //     el.innerHTML = `<div>
//   //   //                       <h2>${object.points[0].source.sensor_description} <br/>
//   //   //                           ${object.position.join(', ')} <br/>
//   //   //                           Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians
//   //   //                       </h2> 
//   //   //                       <svg id="barchart"></svg>
//   //   //                     </div>`
//   //   //     el.style.display = 'block'
//   //   //     el.style.opacity = 0.9
//   //   //     el.style.left = x + 'px'
//   //   //     el.style.top = y + 'px'

//   //   //     generateTooltipChart(object, date)
//   //   //   }
//   //   //   else {
//   //   //     el.style.opacity = 0.0
//   //   //   }
//   //   // })
//  // })

//   deckgl.setProps({
//     layers: [hexLayer]
//   })
//   console.log(deck)
// }
