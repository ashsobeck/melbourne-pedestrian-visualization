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

const data = d3.csv('data/joined_data.csv')

let colorScale = d3.scaleLinear()
  .domain([0, 300])
  .range(d3.schemeDark2)
// const COLOR_RANGE = [
//   [1, 152, 189],
//   [73, 227, 206],
//   [216, 254, 181],
//   [254, 237, 177],
//   [254, 173, 84],
//   [209, 55, 78]
// ];
console.log(colorScale)
renderLayer()
console.log(colorScale(345))

function renderLayer () {
  const hexLayer = new HexagonLayer({
    id: 'melbourne-pedestrian-density',
    data,
    // getColorValue: d => +d.hourly_counts,
    elevationRange: [0, 10],
    elevationScale: 250,
    getElevationValue: points => +points[0].hourly_counts,
    extruded: true,
    getPosition: d => {
      console.log(d)
      console.log(+d.hourly_counts)
      console.log(d.mdate)
      console.log(d.mdate === "0")
      return [+d.longitude, +d.latitude]
    },
    opacity: 1,
    radius: 100,
    coverage: 1,
    upperPercentile: 90
  })

  deckgl.setProps({
    layers: [hexLayer]
  })
}