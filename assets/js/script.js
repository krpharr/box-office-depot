function queryGeoLocation(query) {
    // var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=23228&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA";
    var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // console.log(response);

        let results = response;
        // console.log(response.results[0].formatted_address);
        // console.log(response.results[0].geometry.location);

        var location = {
            address: response.results[0].formatted_address,
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng
        };
        console.log(location)

        localStorage.setItem("bod-zipcodeSearch", JSON.stringify(location));



    });
}

function moviesByZip(zipcode) {
    //
    // Query TMSAPI for all movie showings by zip code and write results to localStarage
    //
    localStorage.setItem("bod-movies-by-zip", zipcode);
    let query = `http://data.tmsapi.com/v1.1/movies/showings?startDate=2019-12-22&zip=${zipcode}&api_key=jzp5d2j4p6udnznt7c3zebps`;
    $.ajax({
        url: query,
        method: "GET"
    }).then(function(response) {
        let movies = response;
        // create array to hold movie info objects
        let movieShowTimes = [];
        //loop array
        movies.forEach(movie => {
            //create movie info object with title and showtimes array
            let movieInfo = {
                title: movie.title,
                showtimes: movie.showtimes
            };
            //push to array
            movieShowTimes.push(movieInfo);
        });
        //build object to store to localStorage
        let showtimesByZip = {
            zip: zipcode,
            showtimes: movieShowTimes
        };
        //write to storage 'bod-showtimes-ZIPCODE'
        localStorage.setItem(`bod-showtimes-${zipcode}`, JSON.stringify(showtimesByZip));
    });
}

function getMovieShowtimes(title) {
    //
    // search local storage by movie title ( call after moviesByZip() ) and return array of showtime info objects
    //
    let zip = localStorage.getItem("bod-movies-by-zip");
    let ls = JSON.parse(localStorage.getItem(`bod-showtimes-${zip}`));
    // console.log(zip, ls);
    // console.log(ls);
    let isPlaying = ls.showtimes.filter(movie => {
        return movie.title === title;
    });
    // console.log(isPlaying);
    if (isPlaying.length < 1) {
        return [];
    }
    return isPlaying;
}

function sortMovieShowtimesByTheatre(movieShowtimesArray) {
    //
    // take in aaray of showtimes for movie ( after calling getMovieShowtimes() ) 
    // sort by theatre and return an array of showtime arrays
    //
    let showtimes = movieShowtimesArray[0].showtimes;
    let id = showtimes[0].theatre.id;
    console.log(movieShowtimesArray);
    console.log(movieShowtimesArray[0].title);
    console.log(showtimes);
    console.log(id);
    let movieByTheatre = [];
    let i = 0;
    let buff = [];
    showtimes.forEach(showtime => {
        console.log(showtime);
        if (id === showtime.theatre.id) {
            buff.push(showtime);
        } else {
            let buff_copy = buff.slice(0);
            movieByTheatre.push(buff_copy);
            buff = [];
            id = showtime.theatre.id;
            i += 1;
        }
    });
    return movieByTheatre;
}

$("#zipcode-submit-ID").on("click", function(event) {
    event.preventDefault();
    queryGeoLocation($("#zipcode-input-ID").val());
});

// Brian's code
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
        // example response pulls for displaying info
        // Alphabetization does matter!

        // response.Title = movie title
        // response.Rated = movie rating (example: pg-13, etc..)
        // response.Released = movie release date
        // response.Poster = movie poster/image
        // response.Plot = movie plot snippit
    })
}

// getMovie();


// Ajax function for Now Playing movies call
// Calls current "Now Playing" movies, without the need of a search input value
function getBoxOffice() {

    var queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=a5366a149888ef9fe65c9fedceb22b79&language=en-US&page=1";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        // Example response pulls for displaying info

        // response.results = Array that contains 20 Box Office movies as objects
        // response.results[0].title = First movie in the array's title
        // response.results[0].overview = First movie in the array's plot snippit
        // response.results[0].release_date = First movie in the array's release date
        // response.results[0].poster_path = First movie in the array's poster/image
    })
}

// Function to pull coming soon movies
function comingSoon() {

    var queryURL = "https://api.themoviedb.org/3/movie/upcoming?api_key=a5366a149888ef9fe65c9fedceb22b79&region=US";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        // Example response pulls for displaying info

        // response.results = Array that contains 20 Box Office movies as objects
        // response.results[0].title = First movie in the array's title
        // response.results[0].overview = First movie in the array's plot snippit
        // response.results[0].release_date = First movie in the array's release date
        // response.results[0].poster_path = First movie in the array's poster/image

        // This is how the link will need to be combined with the poster path to display the movie poster
        var poster = response.results[0].poster_path;
        console.log(poster);
        var link = " http://image.tmdb.org/t/p/w185/";
        console.log(link);
        console.log(link + poster);
    })
}