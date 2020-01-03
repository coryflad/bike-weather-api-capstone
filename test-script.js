'use strict';

const apiKey = 'be67025be3ad63215702c8c628cc2f8c';
const searchURL = 'https://api.openweathermap.org/data/2.5/weather';

// function used to convert wind direction data from degrees 
//to cardinal / intercardinal directions
function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function displayWeatherResults(responseJson) {
    console.log(responseJson);
    $('#weather-results').append(
        `<li>
        <ul>Current Weather for ${responseJson.name}</ul>
        <ul>Temperature:${responseJson.main.temp}&#8457</ul>
        <ul>Wind Speed:${responseJson.wind.speed}MPH</ul>
        <ul>Wind Direction:${degToCompass(responseJson.wind.deg)}</ul>
        </li>`
    )
};

function getWeather(query) {
    const params = {
        q: query,
        APPID: apiKey,
        units: 'imperial',
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeatherResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`${query} ${err.message}! Please re-enter city / town name`);
        });
}


//get user input
function enterLocation() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        getWeather(searchTerm);
    });
}


$(enterLocation);