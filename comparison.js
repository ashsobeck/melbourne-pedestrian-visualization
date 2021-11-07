

const {DeckGL, HexagonLayer} = deck;


const deckgl = new DeckGL({
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: {
    longitude: 144.9631,
    latitude: -37.8136,
    zoom: 12,
    minZoom: 5,
    maxZoom: 20,
    pitch: 55,
    
  },

  getTooltip: ({object}) => {
    //console.log(object)
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians`
},
  controller: true
});

const data = d3.csv('data/2019_pedestrian.csv')//.get((dataset) => dataset)
// console.log(data)

let colorScale = d3.scaleLinear()
  .domain([0, 300])
  .range(d3.schemeCategory10)

