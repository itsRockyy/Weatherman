// All event Listeners
document.getElementById("locate").addEventListener("click", getLocation);
document
  .getElementById("search")
  .addEventListener("click", searchWeatherByCity);

// Global variable for user temperature preference
var tempVar = "Celsius";
var latitude = localStorage.getItem("WeatherManLat");
var longitude = localStorage.getItem("WeatherManLong");

function getLocation() {
  navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
}

// This is executed after succesfully locating clients location
// Also sets the coordinates in local storage to prevent overhead time in future
function geo_success(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  localStorage.setItem("WeatherManLong", longitude);
  localStorage.setItem("WeatherManLat", latitude);
  searchWeatherByCoordinates(latitude, longitude);
}

// Error while geolocating, alert user to choose other option
function geo_error(e) {
  searchWeatherByCoordinates(latitude, longitude);
}

// This sets the options parameter while geolocating client
var geo_options = {
  enableHighAccuracy: false,
  maximumAge: Infinity,
  timeout: 27000
};

//  OpenweatherMap API call by city
function searchWeatherByCity() {
  let searchParam = document.getElementById("searchParam").value;
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchParam +
      "&appid=175bce777dda85d8fbff08fad9286267"
  )
    .then(response => response.json())
    .then(json => {
      console.log(JSON.stringify(json));
      mapResponseToUI(json);
    })
    .catch(error => $("#errorModal").modal("show"));
}

//  OpenweatherMap API call by coordinates
function searchWeatherByCoordinates(latitude, longitude) {
  let searchParam = document.getElementById("searchParam").value;
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=175bce777dda85d8fbff08fad9286267"
  )
    .then(response => response.json())
    .then(json => {
      console.log(JSON.stringify(json));
      mapResponseToUI(json);
    })
    .catch(error => $("#errorModal").modal("show"));
}

// map json response to UI
function mapResponseToUI(json) {
  let temp = Math.round(json.main.temp - 273.15);
  let tempinF = Math.round(json.main.temp * 1.8 - 459.67);
  let windspeed = Math.round(json.wind.speed);
  let direction = getWindIcon(json.wind.deg);
  var sunrise = new Date(json.sys.sunrise * 1000);
  var sunset = new Date(json.sys.sunset * 1000);

  document.getElementById("cityDetails").innerText = json.name;

  document.getElementById("card1").innerHTML = `
    <ul>
    <li>Latitude: ${json.coord.lat}</li>
    <li>Longitude: ${json.coord.lon}</li>
    <li>
    <img src="assets/windmill.png" alt="wind" style="margin-left:-2rem">
    <i class="wi wi-wind ${direction}"></i>${3.6 * windspeed} kmph
    </li>
    </ul>
      `;

  document.getElementById("card2").innerHTML = `
      <ul>
      <li>${json.weather[0].main}</li>
      <li style="text-transform: capitalize">${json.weather[0].description}</li>
      <li style="font-size: 5rem" id="temp"><i class="wi wi-thermometer"></i>${temp}<i class="wi wi-celsius"></i></li>
      <li>
      <button id="changeTemp" class="btn btn-outline-secondary" style="margin-left: 0.6rem" onclick="changeTemp(this)">Don't understand Celsius !</button>
      </li>
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

  document.getElementById("cardbox").style.visibility = "visible";
}

// convert Celsius to Fahrenheit & vice-versa
function changeTemp(e) {
  let temp = document.getElementById("temp").innerText;
  if (tempVar === "Celsius") {
    tempVar = "Fahrenheit";
    var tempConverted = Math.round(1.8 * temp + 32);
    var tempIcon = "wi-fahrenheit";
  } else {
    tempVar = "Celsius";
    var tempIcon = "wi-celsius";
    var tempConverted = Math.round((temp - 32) / 1.8);
  }

  document.getElementById(
    "temp"
  ).innerHTML = `<i class="wi wi-thermometer"></i>${tempConverted}<i class="wi ${tempIcon}"></i>`;
  e.innerHTML = `Don't understand ${tempVar} !`;
}

// set Wind Direction Icons
function getWindIcon(degree) {
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
  $("#errroModal").modal({ show: false });
});
