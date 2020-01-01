'use strict';

const searchURL = "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID=be67025be3ad63215702c8c628cc2f8c"

// function used to convert wind direction data from degrees 
//to cardinal / intercardinal directions
function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

//retrieve data from OpenWeather API
function getWeatherData(city) {
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

//retrieve data from YouTube API
function getYouTubeData(userSearchTerm) {
    $.getJSON("https://www.googleapis.com/youtube/v3/search", {
        part: "snippet", //Youtube API special parameter (please check documentation here https://developers.google.com/youtube/v3/docs/search/list)
        maxResults: 3, //number of results per page
        key: "AIzaSyAAgGwFpTIwbsW533bh_VcsHCeRgtexxKw",
        q: userSearchTerm, //search query from the user
        type: "video" //only return videos (no channels or playlists) so we can take the video ID and link it back to Youtube
    },
        function (receivedApiData) {
            //show the json array received from the API call
            console.log(receivedApiData);
            // if there are no results it will show an error
            if (receivedApiData.pageInfo.totalResults == 0) {
                alert("No videos found!");
            }
            //if there are results, call the displaySearchResults
            else {
                displayYouTube(receivedApiData.items);
            }
        });
}

// displays the results from OpenWeather API
function displayWeather(data) {
    return `
    <div class="weather-results">
        <p>${data.name}</p>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <p>${data.weather[0].main}</p>
        <p>Temperature:${data.main.temp}&#8457</p>
        <p>Wind Speed:${data.wind.speed} MPH</p>
        <p>Wind Direction:${degToCompass(data.wind.deg)}</p>
    </div>`;
}

// displays the results from YouTube API
function displayYouTube(videosArray) {
    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";

    $.each(videosArray, function (videosArrayKey, videosArrayValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        buildTheHtmlOutput += "<li class='search-results'>";
        buildTheHtmlOutput += "<a href='https://www.youtube.com/watch?v=" + videosArrayValue.id.videoId + "' target='_blank'>"; //taget blank is going to open the video in a new window
        buildTheHtmlOutput += "<img class='video' src='" + videosArrayValue.snippet.thumbnails.high.url + "'/>"; //display video's thumbnail
        buildTheHtmlOutput += "</a>";
        buildTheHtmlOutput += "<p>" + videosArrayValue.snippet.title + "</p>"; //output vide title
        buildTheHtmlOutput += "</li>";
    });

    //use the HTML output to show it in the index.html
    $("#search-results ul").html(buildTheHtmlOutput);
}

function enterLocation() {
    $('.search-form').submit(function (event) {
        event.preventDefault();
        let city = $('.search-query').val();
        $('#weather-display').html("");
        $('.weather-row').show();
        getWeatherData(city);
        getYouTubeData(city);
    });
}

//autocomplete location name in user input field
function activatePlacesSearch() {
    let options = {
        types: ['(regions)']
    };
    let input = document.getElementById('search-term');
    let autocomplete = new google.maps.places.Autocomplete(input, options);
}


$(enterLocation);