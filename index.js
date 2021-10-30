const {DeckGL, HexagonLayer} = deck;

const deckgl = new DeckGL({
  mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  initialViewState: {
    longitude: 144.9631,
    latitude: -37.8136,
    zoom: 6,
    minZoom: 5,
    maxZoom: 15,
    pitch: 55
  },
  controller: true
});

const novData = d3.csv('data/nov_2019.csv').then((dataset) => dataset)
const sensorLoc = d3.csv('data/sensor_locations.csv').then((data) => data)

console.log(novData)
console.log(sensorLoc)
console.log(novData)
console.log(sensorLoc)
console.log(novData)
console.log(sensorLoc)
console.log(novData)
console.log(sensorLoc)
console.log(novData)
console.log(sensorLoc)
let colorScale = d3.scaleLinear()
  .domain([0, 300])
  .range(d3.schemeDark2)

renderLayer()

function renderLayer () {
  const hexLayer = new HexagonLayer({
    id: 'heatmap',
    colorRange: colorScale,

  })
}