/* 
    All event Listeners
    Event Listener for Geo-Location Functionality with getLocation() as callback
*/
document.getElementById("locate").addEventListener("click", getLocation);
document.getElementById("search").addEventListener("click", searchWetaher);
// document.getElementById("changeTemp").addEventListener("click", changeTemp);

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
      let temp = Math.round(json.main.temp - 273.15);
      let tempinF = Math.round(json.main.temp * 1.8 - 459.67);
      let windspeed = Math.round(json.wind.speed);
      let direction = toTextualDescription(json.wind.deg);
      var sunrise = new Date(json.sys.sunrise * 1000);
      var sunset = new Date(json.sys.sunset * 1000);

      document.getElementById("card1").innerHTML = `
      <ul>
      <li style="margin-top: 1.5rem"><span class="badge badge-pill badge-dark" style="font-size: 2rem">${
        json.name
      }</span></li>
      <li>Latitude: ${json.coord.lat}</li>
      <li>Longitude: ${json.coord.lon}</li>
    <li>
    <li>
    <img src="assets/windmill.png" alt="wind" style="margin:0">
    <i class="wi wi-wind ${direction}" style="margin-left:-1rem; margin-right:0;font-size: 1.8rem"></i>${3.6 *
        windspeed} kmph
    </li>
    </ul>
      `;

      document.getElementById("card2").innerHTML = `
      <ul>
      <li>${json.weather[0].main}</li>
      <li style="text-transform: capitalize">${json.weather[0].description}</li>
      <li style="font-size: 5rem"><i class="wi wi-thermometer"></i>${temp}<i class="wi wi-celsius"></i></li>
      <button id="changeTemp" class="btn btn-outline-secondary" onclick="changeTemp(this)">Don't understand Celsius !</button>
      </ul>
      `;

      document.getElementById("card3").innerHTML = ` 
      <ul>
      <li> <i class="wi wi-humidity"></i> ${json.main.humidity} %</li>
      <li> <i class="wi wi-barometer"></i> ${json.main.pressure} millibars </li>
      <li> <i class="fas fa-eye"></i>  ${json.visibility} m</li>
      <li> <i class="wi wi-sunrise"></i>  ${sunrise.toLocaleTimeString()}</li>
      <li> <i class="wi wi-sunset"></i>  ${sunset.toLocaleTimeString()}</li>
      </ul>
      `;
    })
    .catch(error => console.log(error));
}

function changeTemp(e) {
  console.log(e.innerHTML);
}

// Wind Direction
function toTextualDescription(degree) {
  if (degree > 337.5) return "wi-towards-n";
  if (degree > 292.5) return "wi-towards-nw";
  if (degree > 247.5) return "wi-towards-w";
  if (degree > 202.5) return "wi-towards-sw";
  if (degree > 157.5) return "wi-towards-s";
  if (degree > 122.5) return "wi-towards-se";
  if (degree > 67.5) return "wi-towards-e";
  if (degree > 22.5) return "wi-towards-ne";
  return "wi-towards-n";
}

// JQuery Initializers
$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});
