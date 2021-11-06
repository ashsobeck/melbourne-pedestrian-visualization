var date
var hour = document.getElementById("hour").value;
function filter_data() {
  //this function gets the date from the filter box, the date is in the format 2012-12-01
  //Year, Month, Day
  date = document.getElementById("date").value;
  hour = document.getElementById("hour").value;

  //will probably need to clear data?
  console.log(date)
  console.log(hour)
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
    // getColorValue: d => +d.hourly_counts,
    elevationRange: [0, 10],
    elevationScale: 250,
    // getElevationValue: (d, points) => {
    //   if (+d.time === hour && date === currDate) {
    //     return points[0].hourly_counts
    //   }
    // },
    // getElevationValue: (d) => {
    //   // console.log(points)?
    //   // console.log(points[0])
    //   console.log(d)
    //   //  points[0].hourly_counts
    //   return +d.hourly_counts
    // },
    extruded: true,
    getPosition: (d, i) => {
      console.log(d)
      console.log(hour)
      if (+d.time === hour ) {
        console.log(i)
        return [+d.longitude, +d.latitude]
      }
      else return [0,0]
      // return [+d.longitude, +d.latitude]

    },
    opacity: 1,
    radius: 50,
    coverage: 1,
    upperPercentile: 90
  })

  deckgl.setProps({
    layers: [hexLayer]
  })
}
