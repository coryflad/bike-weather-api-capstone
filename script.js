'use strict';

/*const apiKey = 'be67025be3ad63215702c8c628cc2f8c';
const searchURL = 'https://api.openweathermap.org/data/2.5/';
*/

const searchURL = "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID=be67025be3ad63215702c8c628cc2f8c"


//retrieve data from OpenWeather API
function getWeatherData() {
    let city = $('.search-query').val();
    $.ajax(searchURL, {
        data: {
            units: 'imperial',
            q: city
        },
        dataType: 'jsonp',
        type: 'GET',
        success: function (data) {
            let widget = displayWeather(data);
            $('#weather-display').html(widget);
        }
    });
}

function displayWeather(data) {
    return `
    <section class="weather-results">
        <h2>Current Weather for ${data.name}</h2>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <p>${data.weather[0].main}</p>
        <p>Temperature:${data.main.temp}&#8457</p>
        <p>Wind Speed:${data.wind.speed} MPH</p>
        <p>Wind Direction:${data.wind.deg}</p>
    </section>`;
}

function enterLocation() {
    $('.search-form').submit(function (event) {
        event.preventDefault();
        $('#weather-display').html("");
        getWeatherData();
    });
}




$(enterLocation);
