/* 
    All event Listeners
    Event Listener for Geo-Location Functionality with getLocation() as callback
*/
document.getElementById("locate").addEventListener("click", getLocation);
document.getElementById("search").addEventListener("click", searchWetaher);

function getLocation() {
  console.log("Getting Location");
  if (
    !(
      localStorage.getItem("WeatherManLong") &&
      localStorage.getItem("WeatherManLat")
    )
  ) {
    navigator.geolocation.getCurrentPosition(
      geo_success,
      geo_error,
      geo_options
    );
  } else {
    console.log("Getting location from storage");
  }
}

// This sets the options parameter while geolocating client
var geo_options = {
  enableHighAccuracy: false,
  maximumAge: Infinity,
  timeout: 27000
};

// This is executed after succesfully locating clients location
// Also sets the coordinates in local storage to prevent overhead time in future
function geo_success(position) {
  localStorage.setItem("WeatherManLong", position.coords.longitude);
  localStorage.setItem("WeatherManLat", position.coords.latitude);
  console.log(position.coords.longitude + "," + position.coords.latitude);
  document.getElementById("output").innerHTML = "Hello World";
}

// Error while geolocating, alert user to choose other option
function geo_error(e) {
  alert("Sorry, no position available. " + e.message);
}

function searchWetaher(e) {
  let searchParam = document.getElementById("searchParam").value;

  //  OpenweatherMap API call
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchParam +
      "&appid=175bce777dda85d8fbff08fad9286267"
  )
    .then(response => response.json())
    .then(json => {
      console.log(JSON.stringify(json));
      var temp = Math.round(json.main.temp - 273.15);

      document.getElementById("card1").innerHTML = `
      <p>${json.name}</p>
      <p>Latitude: ${json.coord.lat}</p>
      <p>Longitude: ${json.coord.lon}</p>
      <h1 class="wi wi-strong-wind"></h1>
      `;

      document.getElementById("card2").innerHTML = `
      <p>${json.weather[0].main}<br>
      <p style="text-transform: capitalize">${json.weather[0].description}</p>
      <p><i class="wi wi-thermometer"></i>${temp}</p>
      `;

      document.getElementById("card3").innerHTML = `  
      <p> <i class="wi wi-humidity"></i> ${json.main.humidity} %</p>
      <p> <i class="wi wi-barometer"></i> ${json.main.pressure} millibars </p>
      <p> <i class="fas fa-eye"></i>  ${json.visibility} m</p>
      `;
    })
    .catch(error => console.log(error));
}

// JQuery Initializers
$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

/*
JSON{
   "name":"Mathura",
   "sys":{"country":"IN"},
    "coord":{  
      "lon":77.69,
      "lat":27.5
   },
   "weather":[  
      {  
         "main":"Clear",
         "description":"clear sky",
         "icon":"01d"
      }
   ],
   "main":{  
      "temp":307.543,
      "humidity":13,
      "temp_min":307.543,
      "temp_max":307.543,
     },
   "wind":{  
      "speed":4.76,
      "deg":315.502
   },
}
*/
