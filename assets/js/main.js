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
      document.getElementById("output").innerHTML = JSON.stringify(json);
    })
    .catch(error => console.log(error));
}
