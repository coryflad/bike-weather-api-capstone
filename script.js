'use strict';

const apiWeatherKey = 'be67025be3ad63215702c8c628cc2f8c';
const searchWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';

const apiYoutubeKey = 'AIzaSyAAgGwFpTIwbsW533bh_VcsHCeRgtexxKw';
const searchYoutubeURL = 'https://www.googleapis.com/youtube/v3/search';

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

//sends call to openweather API
function getWeather(query) {
    const params = {
        q: query,
        APPID: apiWeatherKey,
        units: 'imperial',
    };
    const queryString = formatQueryParams(params)
    const url = searchWeatherURL + '?' + queryString;

    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            displayWeatherResults(responseJson);
            getYouTubeVideos(query);
        })
        .catch(err => {
            $('#weather-results').html();
            $('#js-error-message').text(`${query} ${err.message}! Please re-enter city / town name`);
            $('#weather-results-list').addClass('hidden');
            $('#youtube-results-list').addClass('hidden');
            $('#js-error-message').removeClass('hidden');
        });
}

//sends call to youtube API
function getYouTubeVideos(query) {
    const params = {
        key: apiYoutubeKey,
        q: query,
        part: 'snippet',
        maxResults: 1
    };
    const queryString = formatQueryParams(params)
    const url = searchYoutubeURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYoutubeResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayWeatherResults(responseJson) {
    console.log(responseJson);

    // if there are previous results, remove them
    $('#weather-results').html('');
    console.log('weather results emptied');

    // adds the weather results
    $('#weather-results').append(
        `<li>
        <ul>${responseJson.name}</ul>
        <img src="https://openweathermap.org/img/w/${responseJson.weather[0].icon}.png">
        <ul>${responseJson.weather[0].main}</ul>
        <ul>Temperature:${responseJson.main.temp}&#8457</ul>
        <ul>Wind Speed:${responseJson.wind.speed}MPH</ul>
        <ul>Wind Direction:${degToCompass(responseJson.wind.deg)}</ul>
        </li>`
    )

    // display the results section
    $('#weather-results-list').removeClass('hidden');
    $('#js-error-message').addClass('hidden');
    console.log('weather results displayed');

};

function displayYoutubeResults(responseJson) {
    console.log(responseJson);

    // if there are previous results, remove them
    $('#youtube-results').html('');
    console.log('youtube results emptied');

    // iterate through the items array
    for (let i = 0; i < responseJson.items.length; i++) {

        // for each video object in the items 
        // array, add a list item to the results 
        // list with the video title, description,
        // and thumbnail
        $('#youtube-results').append(
            `<li class="results"><h3>${responseJson.items[i].snippet.title}</h3>
        <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
        </li>`
        )
        // display the results section
        $('#youtube-results-list').removeClass('hidden');
        $('#js-error-message').addClass('hidden');
        console.log('youtube results displayed');
    };
}

//sends call to youtube API
function getYouTubeVideos(query) {
    const params = {
        key: apiYoutubeKey,
        q: query,
        part: 'snippet',
        maxResults: 3
    };
    const queryString = formatQueryParams(params)
    const url = searchYoutubeURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYoutubeResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}


//get user input
function enterLocation() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        if (searchTerm == '') {
            alert('please input city name');
        }
        else {
            getWeather(searchTerm);
        }
    });
}




$(enterLocation);