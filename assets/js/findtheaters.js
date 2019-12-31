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

function populateMovieListings(mArray) {

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