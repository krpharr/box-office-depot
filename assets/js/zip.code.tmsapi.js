const fullDaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

    //////////////////////////////////////////////////////////////////
    /////////////
    /////////////  test data display for the movie search by zip code "Star Wars: The Rise of Skywalker"
    let title = "Star Wars: The Rise of Skywalker";
    container = $("#placeholder-info-ID");
    container.empty().append($("<h2>").text(title), $("<h4>").text(`${fullDaysOfWeek[moment().weekday()]} ${moment().format("M/D/YYYY")}`));
    let theaters = sortMovieShowtimesByTheatre(getMovieShowtimes(title));
    // console.log(theaters);
    theaters.forEach(theatre => {
        let div = $("<div class='col s12' style='border: 1px solid black; margin: 8px 0;padding: 8px!important;display: flex;flex-wrap: wrap;'>");
        let h3 = $("<h3 style='width:100%'>").text(theatre[0].theatre.name);
        div.append(h3);
        let row = $("<div class='row center'>");
        theatre.forEach(showtime => {
            let showtime_div = $("<div class='col s2 center' style='display: inline; margin: 2px; padding: 4px;border: 1px solid black;'>");
            var fandango;
            if (showtime.ticketURI) {
                fandango = $(`<a href='${showtime.ticketURI}' target='_blank' style='margin-left: 4px;'>${moment(showtime.dateTime).format("h:mm a")}</a>`);
            } else {
                fandango = $("<p style='display: inline; margin-left: 8px;'>").text(moment(showtime.dateTime).format("h:mm a"));
            }
            showtime_div.append(fandango);
            row.append(showtime_div);
        });
        div.append(row);
        container.append(div);
    });
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

});