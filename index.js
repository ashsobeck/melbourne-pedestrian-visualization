var date
var hour

//this function gets the date from the filter box, the date is in the format 2012-12-01
//Year, Month, Day
function filter_data() {

  date = document.getElementById("date").value;
  hour = document.getElementById("hour").value;

  //will probably need to clear data?
  console.log(date)
  console.log(hour)
}


//when window loads, js gets the default filter values
window.onload = function()
{
  filter_data();
}

const {DeckGL, HexagonLayer} = deck;

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
  getTooltip: ({object}) => {
    console.log(object)
    return object && `${object.points[0].source.sensor_description}
    ${object.position.join(', ')} 
    Hourly Count: ${object.points[0].source.hourly_counts} Pedestrians`
},
  controller: true
});

const data = d3.csv('data/2019_pedestrian.csv').get((dataset) => dataset)
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
renderLayer()

function renderLayer () {
  const hexLayer = new HexagonLayer({
    id: 'melbourne-pedestrian-density',
    data,
    pickable: true,
    getColorValue: d => {
      return +d[0].hourly_counts.replace(/,/g,'')
    },

    getElevationValue: d => {
      console.log(d[0].hourly_counts.replace(/,/g,''))
      return +d[0].hourly_counts.replace(/,/g,'')
    },
    extruded: true,
    getPosition: (d, i) => {
      if (+d.time == hour ) {
        return [+d.longitude, +d.latitude]
      }
      else return []
    },
    opacity: 1,
    radius: 50,
    coverage: 1,
    upperPercentile: 90,
  })

  deckgl.setProps({
    layers: [hexLayer]
  })
  console.log(deck)
}
