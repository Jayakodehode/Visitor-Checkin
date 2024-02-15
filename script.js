const form = document.getElementById('velg-reise');
const bussElement = document.getElementById('reise-med-buss');
const reiseOptioner = document.getElementById('reise-optioner');
const bilElement = document.getElementById('reise-med-bil');
const taxiElement = document.getElementById('reise-med-taxi');
const travelInfo = document.getElementById('travel-info');
const parkingInfo = document.getElementById('parking-info');

const bussMapElement = document.getElementById('bussmap');
/* --- comparing userlocation with destination if it true user will get the parking information if not user will get information about travel ---*/
const destination = [ 5.6971496,58.8973109];


if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        const userPosition = [position.coords.latitude, position.coords.longitude];
        console.log(userPosition);

        const distance = calculateDistance(userPosition[0], userPosition[1], destination[0], destination[1]);

        // Define a threshold distance in kilometers (adjust as needed)
        const threshold = 0.1;

        if (distance <= threshold) {
            console.log("User reached destination");
            travelInfo.style.display = "none";
        } else {
            console.log("Need to reach destination");
            parkingInfo.style.display = "none";
        }

    });
} else {
    /* geolocation IS NOT available, handle it */
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/*trying to reduce function code */
function map(mapElement){
   /* eslint-disable-next-line no-unused-vars */
    mapboxgl.accessToken = 'pk.eyJ1IjoiamF5YTEyIiwiYSI6ImNsc2EwNmZzYzBlYWEyanBsa2RkZHB3M2UifQ.0IIVmcXBontNbamT0jiwrg';
  
 
    var map = new mapboxgl.Map({
        container: mapElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [5.697051727843015 , 58.89736542277616], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });
}

/*mapbox integration for buss element*/
function bilmap(){
mapboxgl.accessToken = 'pk.eyJ1IjoiamF5YTEyIiwiYSI6ImNsc2EwNmZzYzBlYWEyanBsa2RkZHB3M2UifQ.0IIVmcXBontNbamT0jiwrg';
    var map = new mapboxgl.Map({
        container: 'bilmap',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [5.697051727843015 , 58.89736542277616], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });
const start = [5.697051727843015 , 58.89736542277616];

async function getRoute(end) {
   
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // add turn instructions here at the end
  }
  
  map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location
    getRoute(start);
  
    // Add starting point to the map
    map.addLayer({
      id: 'point',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: start
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#3887be'
      }
    });
    // this is where the code from the next step will go

    map.on('click', (event) => {
        const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
        const end = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        };
        if (map.getLayer('end')) {
          map.getSource('end').setData(end);
        } else {
          map.addLayer({
            id: 'end',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Point',
                      coordinates: coords
                    }
                  }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#f30'
            }
          });
        }
        getRoute(coords);
      });
  });
}
function taximap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiamF5YTEyIiwiYSI6ImNsc2EwNmZzYzBlYWEyanBsa2RkZHB3M2UifQ.0IIVmcXBontNbamT0jiwrg';
    var map = new mapboxgl.Map({
        container: 'taximap',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [5.69725, 58.89737], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.addControl(
      geolocateControl,
      'bottom-left'
    );
    
    geolocateControl.on('geolocate', (event) => {
      const lat = event.coords.latitude;
      const lng = event.coords.longitude;
      var marker = new mapboxgl.Marker({
        color: "#000000",
        draggable: false
      }).setLngLat([lng, lat]).addTo(map);
    
     
      // Do something more with lat & long here :)
    });  
}
/*
function bilmap(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiamF5YTEyIiwiYSI6ImNsc2EwNmZzYzBlYWEyanBsa2RkZHB3M2UifQ.0IIVmcXBontNbamT0jiwrg';
    if ("geolocation" in navigator) { 
      navigator.geolocation.getCurrentPosition(position => { 
        var lng =position.coords.longitude
        var lat =position.coords.latitude
        var map = new mapboxgl.Map({
          container: 'bilmap',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng,lat], // starting position [lng, lat]
          zoom:14 // starting zoom
      });
      var marker = new mapboxgl.Marker({
        color: "#000000",
        draggable: true
      }).setLngLat([lng, lat]).addTo(map);
          
      }); 
  } else { /* geolocation IS NOT available, handle it 
console.log("didn't find location");}
  
   
}*/

function reisevalg(reiseoption) {
     // Hide all elements by default
     bussElement.style.display = "none";
     bilElement.style.display = "none";
     taxiElement.style.display = "none";
     

     // Show the specific element based on the selected option
     switch (reiseoption) {
         case "buss":
             bussElement.style.display = "block";

             /*const buss = document.getElementById("bussmap");
            map(bussmap);*/
             break;
         case "bil":
             bilElement.style.display = "block";
             bilmap();
             console.log("calling");

             break;
         case "taxi":
            taxiElement.style.display = "block";
         taximap();



            break;
         // Add more cases for other options if needed
         default:
             break;
     }
   
}

form.addEventListener('input', () => {
    const reiseOption = reiseOptioner.value;
    reisevalg(reiseOption);
});

