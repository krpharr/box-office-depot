$(document).ready(function() {
    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;

        // test code //
        // var crd = {
        //     latitude: 40.7484405,
        //     longitude: -73.9856644
        // };
        ////////////

        // console.log('Your current position is:');
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
        queryZipCodeByLocation(crd);
        $(".available-with-location").show();
        $("#small-loader").hide();
        $("#select-movies-loader").hide();
        $("#select-movies-form-ID").show();
    }

    function error(err) {
        // $('#modal1').modal('open');
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    $(".available-with-location").hide();
    $("#select-movies-form-ID").hide();
    navigator.geolocation.getCurrentPosition(success, error, options);
});

function queryZipCodeByLocation(coords) {
    let str = coords.latitude.toFixed(2);
    // console.log("toFixed", str);
    var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude.toFixed(2)},${coords.longitude.toFixed(2)}&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response) {
        // console.log("then", response);
        if (response.status === "ZERO_RESULTS") {

        } else {
            // console.log(response.results[0].formatted_address);
            // console.log(response.results[0].geometry.location);
            var location = {
                address: response.results[0].formatted_address,
                lat: response.results[0].geometry.location.lat,
                lng: response.results[0].geometry.location.lng
            };
            // console.log(location)
            let acArray = response.results[0].address_components;
            // console.log("acArray", acArray);
            var zipcode;
            for (let i = 0; i < acArray.length; i++) {
                if (acArray[i].types[0] === "postal_code") {
                    zipcode = acArray[i].long_name;
                }
            }
            // console.log(zipcode);
            // save zip code to local storage
            localStorage.setItem("bod-movies-by-zip", JSON.stringify(zipcode));
            $("#zipcode-input-ID").val(zipcode);
            // queary data and store in ls
            moviesByZip(zipcode);
        }
    }).fail(function() {
        $('#modal1').modal('open');
    });
}

////////////////////////////   This code needs to be attached, on click, when searching for a movie ////////// 
// Ajax function for OMDb call
function getMovie() {
    var queryURL = "https://www.omdbapi.com/?t=avengers&apikey=e2a8b4bf&";
    // Declaring the url, depending on the title search input
    // placeHolder being = input value
    // var queryURL = "https://www.omdbapi.com/?t=" + placeHolder + "&apikey=e2a8b4bf&";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        // Below will create a horizontal card
        // This card will display the movie image, title, release date, rated, plot, and Rotten Tomato score
        // This should be called in an "on click" event, when the user searches a movie
        // We also need to figure out where we want this card to be displayed
        // The card will also need some css styling
        // I can also give these elements ID's for easier styling
        var searchCard = $("<div class='card horizontal'>");
        var searchImgContainer = $("<div class='card-image'>");
        var searchImg = $("<img>").attr("src", response.Poster);
        var searchContent = $("<div class='card-content'>");

        searchContent.append($("<h5>").text(response.Title));
        searchContent.append($("<p>").text(response.Released));
        searchContent.append($("<p>").text(response.Rated));
        searchContent.append($("<p>").text(response.Plot));


        searchContent.append($("<p>").text(response.Ratings[1].Source + ": " + response.Ratings[1].Value));
    })
}

// getMovie();


// Ajax function for Now Playing movies call
// Calls current "Now Playing" movies, without the need of a search input value
var movieDBload = false;

function getBoxOffice() {

    var queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=a5366a149888ef9fe65c9fedceb22b79&language=en-US&page=1";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        movieDBload = true;

        console.log(response);

        // Declaring the image link as a variable.  To be combined with the poster path in for loop.
        var link = " http://image.tmdb.org/t/p/w185/";

        $(".card").css("width", 200);
        $(".activator").attr("src", link + poster);
        $(".activator").css("width", 200);

        $(".card-title").css("width", 150);

        // For loop to create a movie card for each movie in the call response
        for (var i = 0; i < response.results.length; i++) {

            // Path for the poster to be combined with the link
            var poster = response.results[i].poster_path

            // Creating a card for each movie in the response, using Materialize classes
            var card = $("<div class='card'>").attr("id", "card" + i);
            $("#now-playing-ID").append(card);

            // Putting the image in the card, using Materialize classes
            var cardImageContainer = $("<div class='card-image waves-effect waves-block waves-light'>");
            var cardImage = $("<img class='activator'>").attr("src", link + poster).attr("id", "img" + i);
            cardImageContainer.append(cardImage);
            card.append(cardImageContainer);

            // Putting the movie title in the card, using Materialize classes
            var cardContent = $("<div class='card-content'>");
            card.append(cardContent);
            var cardTitle = $("<span>").text(response.results[i].title);
            cardTitle.addClass("card-title activator grey-text text-darken-4");
            cardContent.append(cardTitle);

            // Creating the "reveal" on click button, to display movie synopsis
            var cardReveal = $("<div class='card-reveal'>").css("style", "display: block");
            card.append(cardReveal);
            var closeBtn = $("<i class='material-icons right'>").text("close");
            var cardRevealTitle = $("<span>").text(response.results[i].title).append(closeBtn);
            cardRevealTitle.addClass("card-title grey-text text-darken-4");
            cardReveal.append(cardRevealTitle);
            var cardRevealInfo = $("<p>").text(response.results[i].overview);
            cardReveal.append(cardRevealInfo);
        }

        ////////////////////////////////
        // populate movie selector and find showtimes form
        //
        let mArray = response.results;
        console.log(mArray);
        mArray.forEach(movie => {
            let div = $("<div>");
            let cb = $("<input  type='checkbox' class='filled-in'>");
            cb.attr("data-title", movie.title);
            let label = $("<label>");
            let span = $("<span>").text(movie.title);
            label.append(cb, span);
            div.append(label);
            $("#select-current-movies-ID").append(div);

        });
        ////////////////////////////////
    })
}

$("#now-playing-ID").hide();
getBoxOffice();

$(document).ready(function() {
    let interval = setInterval(function() {
        console.log(movieDBload);
        if (movieDBload) {
            clearInterval(interval);
            $("#top-rated-loader").hide();
            $("#now-playing-ID").show();
        }
    }, 10);
});


////////////////////////////////
//  movies by zip showtimes search button event handler
//
$("#btn-movies-by-zip-ID").on("click", function(event) {
    event.preventDefault();
    // primitive validation
    let zipcode = $("#zipcode-input-ID").val();
    if (zipcode === "") {
        return;
    }

    // get checkbox elements
    let cbArray = $(this)[0].form.elements;
    // create array to hold selected movie titles
    let selMoviesTitleArray = [];
    // find movies that are selected and push to array
    for (let i = 0; i < cbArray.length; i++) {
        if (cbArray[i].checked) {
            selMoviesTitleArray.push($(cbArray[i]).data("title"));
        }
    }
    // if none are selected -> push all movie titles
    if (selMoviesTitleArray.length < 1) {
        for (let i = 0; i < cbArray.length; i++) {
            selMoviesTitleArray.push($(cbArray[i]).data("title"));
        }
    }
    let saveData = {
        zip: zipcode,
        titleArray: selMoviesTitleArray
    };
    // save to local storage
    localStorage.setItem("bod-movies-by-zip", zipcode);
    localStorage.setItem("bod-search-showtimes-zip", JSON.stringify(saveData));
    window.location.replace("FindTheaters.html");
});