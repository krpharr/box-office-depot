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
    console.log("event");
    queryGeoLocation($("#zipcode-input-ID").val());
    moviesByZip($("#zipcode-input-ID").val());
});