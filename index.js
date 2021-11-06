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
renderLayer()

function renderLayer () {
  const hexLayer = new HexagonLayer({
    id: 'melbourne-pedestrian-density',
    data,
    pickable: true,
    getColorValue: d => {
      console.log(d[0].hourly_counts)
      return +d[0].hourly_counts
    },
    elevationRange: [0, 10],
    elevationScale: 250,
    getElevationValue: d => {
      console.log(d[0].hourly_counts)
      return +d[0].hourly_counts
      // if (+d.time == hour) {
      //   return +d[0].hourly_counts
      // }
      // else return 0
    },
    // getElevationValue: (d) => {
    //   // console.log(points)?
    //   // console.log(points[0])
    //   console.log(d)
    //   //  points[0].hourly_counts
    //   return +d.hourly_counts
    // },
    extruded: true,
    getPosition: (d, i) => {
      // console.log(d)
      // console.log(+d.time)
      // console.log(hour)
      // console.log(+d.time == hour)
      if (+d.time == hour) {
        // console.log(i)
        console.log(d)
        return [+d.longitude, +d.latitude]
      }
      else return []
      // return [+d.longitude, +d.latitude]

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
