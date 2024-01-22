let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

// loading
const loading = document.querySelector('.loading');
// input 
const input = document.querySelector('#searchInput');

// current day
const daysElements = document.querySelectorAll('.day');
const locationName = document.querySelector('#location');
const temp = document.querySelector('#temp');
const conditionName = document.querySelector('#conditionName');
const wind = document.querySelector('.weather-data .content1 .wind');

// next day
const nextDayElement = document.querySelector('.content2 .details');

// day before next day
const dayBeforeNextDayElement = document.querySelector('.content3 .details');

// get country name
getLocation();
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCountryName);
    } else {
        getWeather("Cairo");
    }
}

function getCountryName(position) {

    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    const url = `https://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=youssefhilaly`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let country = data.countryName;
            getWeather(country);
        })
        .catch(error => getWeather("Cairo"));
}


input.addEventListener('keyup', (e) => {
    const city = input.value;
    getWeather(city);
});

function getWeather(city) {
    console.log(city)
    const url = `https://api.weatherapi.com/v1/forecast.json?key=2c0b50c8c0814330909181042242201&q=${city}&days=3&aqi=no&alerts=no`;
    fetch(url)
        .then(response => response.json())
        .then(data => showWeather(data))
        .catch(error => console.log(error));
}

function showWeather(data) {
    if (data.error) {
        return;
    }
    const { location, current, forecast } = data;

    // current day
    let yearMonthDay = location.localtime.split(' ')[0];
    let date = new Date(yearMonthDay);
    let day = date.getDay();
    let month = date.getMonth();


    //  day one header
    daysElements[0].innerHTML =
        `<h5 class="text-center">${days[day]}</h5>
        <h5 class="text-center">${yearMonthDay.split('-')[2]} ${months[month]}</h5>`

    // day one body
    locationName.innerHTML = `<h5 id="location">${location.name}</h5>`

    temp.innerHTML =
        `<div class="temp d-flex align-items-center">
            <h2>${current.temp_c}°C</h2>
            <img src="http:${current.condition.icon}" alt="${current.condition.text}">
        </div>`

    conditionName.innerHTML = `<p id="conditionName">${current.condition.text}</p>`


    const { humidity, wind_kph, wind_dir } = current;

    wind.innerHTML = `
    <div class="d-flex align-items-center justify-content-between">
        <div class="rain d-flex">
            <i class="fa-solid fa-umbrella"></i>
            <p>${humidity}%</p>
        </div>
        <div class="speed d-flex">
            <i class="fa-solid fa-wind"></i>
            <p>${wind_kph} km/h</p>
        </div>
        <div class="direction d-flex">
            <i class="fa-solid fa-compass"></i>
            <p>${wind_dir}NE</p>
        </div>
    </div>`



    // next day
    // day two header
    daysElements[1].innerHTML = `<h5>${days[(day + 1) % 6]}</h5>`

    // day two body
    let nextDay = forecast.forecastday[1];
    nextDayElement.innerHTML =
        `<div class="temp">
            <img src="http:${nextDay.day.condition.icon}" alt="${nextDay.day.condition.text}">
            <h3>${nextDay.day.avgtemp_f}°C</h3>
            <p>${nextDay.day.avgtemp_f}°</p>
        </div>
        <p>${nextDay.day.condition.text}</p>`


    // day before next day
    // day three header
    daysElements[2].innerHTML = `<h5>${days[(day + 2) % 6]}</h5>`

    // day three body
    let dayBeforeNextDay = forecast.forecastday[2];
    dayBeforeNextDayElement.innerHTML = `
        <div class="temp">
            <img src="http:${dayBeforeNextDay.day.condition.icon}" alt="${dayBeforeNextDay.day.condition.text}">
            <h3>${dayBeforeNextDay.day.avgtemp_f}°C</h3>
            <p>${dayBeforeNextDay.day.avgtemp_f}°</p>
        </div>
        <p>${dayBeforeNextDay.day.condition.text}</p>`

        if (loading) {
            loading.remove();
        }
}