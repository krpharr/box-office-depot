const fullDaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const api_key = "awz432na4ksp6amr5xe8bjhq";
// const api_key = "jzp5d2j4p6udnznt7c3zebps";
//const api_key = "p9g59wgk4b3g7u3y8vrraxs4";

function moviesByZip(zipcode) {
    //
    // Query TMSAPI for all movie showings by zip code and write results to localStarage
    //
    // localStorage.setItem("bod-movies-by-zip", zipcode);
    let day = moment().format("YYYY-MM-DD");
    let query = `https://data.tmsapi.com/v1.1/movies/showings?startDate=${day}&zip=${zipcode}&api_key=${api_key}`;
    $.ajax({
        url: query,
        method: "GET"
    }).then(function(response) {
        // let movies = response;
        // console.log("movies", response);
        // create array to hold movie info objects
        let movieShowTimes = [];
        //loop array
        response.forEach(movie => {
            //create movie info object with title and showtimes array
            let movieInfo = {
                title: movie.title,
                id: movie.id,
                releaseDate: movie.releaseDate,
                genres: movie.genres,
                longDescription: movie.longDescription,
                shortDescription: movie.shortDescription,
                topCast: movie.topCast,
                directors: movie.directors,
                ratings: movie.ratings,
                preferredImage: movie.preferredImage,
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

function getShowTimesFromLocalStorage() {
    let zip = JSON.parse(localStorage.getItem("bod-movies-by-zip"));
    let ls = JSON.parse(localStorage.getItem(`bod-showtimes-${zip}`));
    return ls;
}

function getMovieShowtimes(title) {
    //
    // search local storage by movie title ( call after moviesByZip() ) and return array of showtime info objects
    //
    let zip = JSON.parse(localStorage.getItem("bod-movies-by-zip"));
    $(".zip").text(zip);
    let ls = JSON.parse(localStorage.getItem(`bod-showtimes-${zip}`));
    if (ls === null || ls.length < 1) {
        ls = [];
        // ls.push(`${title} - not playing in zip code.`);
        return ls;
    }
    // console.log(zip, ls);
    let isPlaying = ls.showtimes.filter(movie => {
        return movie.title === title;
        // console.log(movie.title, title);
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
    let movieByTheatre = [];
    let i = 0;
    let buff = [];
    showtimes.forEach(showtime => {
        // console.log(showtime);
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
    if (buff !== []) {
        movieByTheatre.push(buff);
    }
    return movieByTheatre;
}