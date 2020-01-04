'use strict';

const apiKey = 'be67025be3ad63215702c8c628cc2f8c';
const searchURL = 'https://api.openweathermap.org/data/2.5/weather';

// const apiKey = 'AIzaSyAAgGwFpTIwbsW533bh_VcsHCeRgtexxKw';
// const searchURL = 'https://www.googleapis.com/youtube/v3/search';

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
    
    // if there are previous results, remove them
    $('#weather-results').empty();
    $('#js-error-message').empty();

    $('#weather-results').append(
        `<li>
        <ul>Current Weather for ${responseJson.name}</ul>
        <ul>Temperature:${responseJson.main.temp}&#8457</ul>
        <ul>Wind Speed:${responseJson.wind.speed}MPH</ul>
        <ul>Wind Direction:${degToCompass(responseJson.wind.deg)}</ul>
        </li>`
    )
};

/*function displayResults(responseJson) {
    console.log(responseJson);

    // if there are previous results, remove them
    $('#youtube-results').empty();

    // iterate through the items array
    for (let i = 0; i < responseJson.items.length; i++) {

        // for each video object in the items 
        // array, add a list item to the results 
        // list with the video title, description,
        // and thumbnail
        $('#youtube-results').append(
            `<li><h3>${responseJson.items[i].snippet.title}</h3>
        <p>${responseJson.items[i].snippet.description}</p>
        <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
        </li>`
        )
    };
}*/

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
            $('#weather-results').empty();
            $('#js-error-message').text(`${query} ${err.message}! Please re-enter city / town name`);
        });
}

// display the results section  
/*function getYouTubeVideos(query, maxResults = 2) {
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        maxResults
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}*/


//get user input
function enterLocation() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        // const maxResults = $('#js-max-results').val();
        // getYouTubeVideos(searchTerm, maxResults);
        getWeather(searchTerm);
    });
}


$(enterLocation);