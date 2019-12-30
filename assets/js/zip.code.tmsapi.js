const fullDaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const api_key = "p9g59wgk4b3g7u3y8vrraxs4";

let lsData = JSON.parse(localStorage.getItem("bod-search-showtimes-zip"));
console.log(lsData.zip, typeof lsData.zip);
console.log("lsData", lsData);
moviesByZip(lsData.zip);

let movies = [];
lsData.titleArray.forEach(title => {
    let sA = getMovieShowtimes(title);
    var showing = true;
    if (sA.length < 1) showing = false;
    let data = {
        title: title,
        showing: showing,
        showtimes: sA
    }
    movies.push(data);
    console.log(typeof id);
});

console.log("movies", movies);
populateMovieListings(movies);



function moviesByZip(zipcode) {
    //
    // Query TMSAPI for all movie showings by zip code and write results to localStarage
    //
    localStorage.setItem("bod-movies-by-zip", zipcode);
    let day = moment().format("YYYY-MM-DD");
    let query = `http://data.tmsapi.com/v1.1/movies/showings?startDate=${day}&zip=${zipcode}&api_key=${api_key}`;
    $.ajax({
        url: query,
        method: "GET"
    }).then(function(response) {
        let movies = response;
        console.log("movies", movies);
        // create array to hold movie info objects
        let movieShowTimes = [];
        //loop array
        movies.forEach(movie => {
            //create movie info object with title and showtimes array
            let movieInfo = {
                title: movie.title,
                id: movie.id,
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
    $(".zip").text(zip);
    let ls = JSON.parse(localStorage.getItem(`bod-showtimes-${zip}`));
    if (ls === null || ls.length < 1) {
        ls = [];
        // ls.push(`${title} - not playing in zip code.`);
        return ls;
    }
    console.log(zip, ls);
    let isPlaying = ls.showtimes.filter(movie => {
        return movie.title === title;
        console.log(movie.title, title);
    });
    console.log(isPlaying);
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
    // console.log(movieShowtimesArray);
    // console.log(movieShowtimesArray[0].title);
    // console.log(showtimes);
    // console.log(id);
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
    return movieByTheatre;
}

function populateMovieListings(mArray) {
    // let title = "Star Wars: The Rise of Skywalker";

    let container = $("#placeholder-info-ID");
    container.empty();
    mArray.forEach(movie => {
        console.log(movie.title);
        // if movie is not playing - add to not playing div
        if (movie.showing === false) {
            $("#not-playing-in-zip-ID").show();
            $("#not-playing-in-zip-ID").append($("<div>").text(movie.title));
        } else {
            let movieInfo = $("<div>").addClass("movie-and-theaters-container");
            movieInfo.append($("<h2>").text(movie.title), $("<h4>").text(`${fullDaysOfWeek[moment().weekday()]} ${moment().format("M/D/YYYY")}`));

            let theaters = sortMovieShowtimesByTheatre(getMovieShowtimes(movie.title));
            console.log("theaters", theaters);

            theaters.forEach(theatre => {
                if (theatre.length > 0) {
                    let div = $("<div class='col s12 theaters'>");
                    let h3 = $("<h3 style='width:100%'>").text(theatre[0].theatre.name);
                    div.append(h3);
                    let row = $("<div class='row theatre-showtimes'>");
                    theatre.forEach(showtime => {
                        let showtime_div = $("<div class='center showtime'>");
                        var fandango;
                        // todo -> check to see if showtime has passed and grey out text and no liks to fandango
                        if (showtime.ticketURI) {
                            fandango = $(`<a href='${showtime.ticketURI}' target='_blank' style='margin-left: 4px;'>${moment(showtime.dateTime).format("h:mm a")}</a>`);
                        } else {
                            fandango = $("<p style='display: inline; margin-left: 8px;'>").text(moment(showtime.dateTime).format("h:mm a"));
                        }
                        showtime_div.append(fandango);
                        row.append(showtime_div);
                    });
                    div.append(row);
                    movieInfo.append(div);

                }

            });
            container.append(movieInfo);
        }

    });

}