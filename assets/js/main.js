// Global variable for user temperature preference
let tempVar = "Celsius";
let latitude = localStorage.getItem("WeatherManLat");
let longitude = localStorage.getItem("WeatherManLong");

const getLocation = () =>
  navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);

// This is executed after succesfully locating clients location
// Also sets the coordinates in local storage to prevent overhead time in future
const geo_success = (position) => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  localStorage.setItem("WeatherManLong", longitude);
  localStorage.setItem("WeatherManLat", latitude);
  searchWeatherByCoordinates(latitude, longitude);
};

// Error while geolocating, alert user to choose other option
const geo_error = (e) => {
  searchWeatherByCoordinates(latitude, longitude);
};

// This sets the options parameter while geolocating client
const geo_options = {
  enableHighAccuracy: false,
  maximumAge: Infinity,
  timeout: 27000,
};

//  OpenweatherMap API call by city
const searchWeatherByCity = () => {
  let searchParam = document.getElementById("searchParam").value;
  fetch(`https://itsrockyy-api.netlify.app/weatherman?q=${searchParam}`)
    .then((response) => response.json())
    .then((json) => mapResponseToUI(json))
    .catch(() => $("#errorModal").modal("show"));
};

//  OpenweatherMap API call by coordinates
const searchWeatherByCoordinates = (latitude, longitude) => {
  fetch(
    `https://itsrockyy-api.netlify.app/weatherman?lat=${latitude}&lon=${longitude}`
  )
    .then((response) => response.json())
    .then((json) => mapResponseToUI(json))
    .catch(() => $("#errorModal").modal("show"));
};

// map json response to UI
const mapResponseToUI = (json) => {
  let temp = Math.round(json.main.temp - 273.15);
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
};

// convert Celsius to Fahrenheit & vice-versa
const changeTemp = (e) => {
  const temp = document.getElementById("temp").innerText;

  tempVar = tempVar === "Celsius" ? "Fahrenheit" : "Celsius";
  const tempConverted =
    tempVar !== "Celsius"
      ? Math.round(1.8 * temp + 32)
      : Math.round((temp - 32) / 1.8);
  const tempIcon = tempVar !== "Celsius" ? "wi-fahrenheit" : "wi-celsius";

  document.getElementById(
    "temp"
  ).innerHTML = `<i class="wi wi-thermometer"></i>${tempConverted}<i class="wi ${tempIcon}"></i>`;
  e.innerHTML = `Don't understand ${tempVar} !`;
};

// set Wind Direction Icons
const getWindIcon = (degree) => {
  if (degree > 337.5) return "wi-towards-n";
  if (degree > 292.5) return "wi-towards-nw";
  if (degree > 247.5) return "wi-towards-w";
  if (degree > 202.5) return "wi-towards-sw";
  if (degree > 157.5) return "wi-towards-s";
  if (degree > 122.5) return "wi-towards-se";
  if (degree > 67.5) return "wi-towards-e";
  if (degree > 22.5) return "wi-towards-ne";
  return "wi-towards-n";
};

// JQuery Initializers
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $("#errroModal").modal({ show: false });
});

// All event Listeners
document.getElementById("locate").addEventListener("click", getLocation);
document
  .getElementById("search")
  .addEventListener("click", searchWeatherByCity);
