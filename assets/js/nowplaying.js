let lsShowtimes = getShowTimesFromLocalStorage();
if (lsShowtimes === null) {
  let zip = JSON.parse(localStorage.getItem("bod-movies-by-zip"));
  if (zip === null) {
    // todo:
  }
  moviesByZip(zip);
  lsShowtimes = getShowTimesFromLocalStorage();
  if (lsShowtimes === null) {
    console.log("covid?");
    $("#none-found-ID").html("No showtimes found for your zipcode. Error: Covid-19<br>See <a href='map.html'>map.html</a> for list of local theaters and call for up to date closure information.")
  }
}
let movies = lsShowtimes.showtimes;
var movie;
for (let i = 0; i < movies.length; i++) {
  let a = $("<a>").addClass("carousel-item").attr("href", `#`).attr("data-title", movies[i].title);
  let str = movies[i].preferredImage.uri;
  let img = $("<img>").attr("src", `https://cuso.tmsimg.com/${str}?api_key=4nqkg4kpgvpd82mnyyhq3g5s`);
  a.append(img);
  $("#now-playing-carousel-ID").append(a);
}
$('.carousel').carousel();
$('.carousel').carousel({
  onCycleTo: function(ele) {
    displayMovieInfo();
  }
});

function displayMovieInfo() {
  let ciArray = $(".carousel-item");
  //find active carousel item and get title, return if no title
  var title = "";
  for (let i = 0; i < ciArray.length; i++) {
    if ($(ciArray[i]).hasClass("active")) {
      title += ciArray[i].dataset.title;
    }
  }
  if (title === "") return;
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].title === title) {
      movie = movies[i];
    }
  }
  var str = "";
  $("#movie-title-ID").text(movie.title);
  if (movie.ratings) {
    $("#movie-rating-ID").text(movie.ratings[0].code);
  }
  movie.topCast.forEach(actor => {
    str += actor + "  ";
  });
  $("#movie-top-cast-ID").html(`<pre>${str}</pre>`);
  str = "";
  movie.directors.forEach(director => {
    str += director + "  ";
  });
  $("#movie-directors-ID").text(str);
  $("#movie-shortDescription-ID").text(movie.shortDescription);
  $("#movie-longDescription-ID").text(movie.longDescription);
  str = "";
  movie.genres.forEach(genre => {
    str += genre + "  ";
  });
  $("#movie-releaseDate-genres-ID").text(`${movie.releaseDate}  ${str}`);
  let container = $("#movie-theater-showtimes-ID");
  container.empty();
  let theaters = sortMovieShowtimesByTheatre(getMovieShowtimes(movie.title));
  theaters.forEach(theatre => {
    if (theatre.length > 0) {
      let div = $("<div class='col s12 theaters'>");
      let h3 = $("<h3 style='width:100%'>").text(theatre[0].theatre.name);
      div.append(h3);
      let a = $("<a>").attr("href", "map.html").text("Find In Maps");
      div.append(a);
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
      container.append(div);
    }
  });
}