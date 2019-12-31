let lsShowtimes = getShowTimesFromLocalStorage();

console.log("lsShowtimes", lsShowtimes);

console.log(lsShowtimes.showtimes.length);

let movies = lsShowtimes.showtimes;

for (let i = 0; i < movies.length; i++) {
    // console.log("what the fuck");
    // console.log(movies[i]);

    let a = $("<a>").addClass("carousel-item").attr("href", `#${i}`);
    let str = movies[i].preferredImage.uri;
    // console.log(str);
    let img = $("<img>").attr("src", `https://cuso.tmsimg.com/assets/${str}?api_key=4nqkg4kpgvpd82mnyyhq3g5s`);
    a.append(img);
    $("#now-playing-carousel-ID").append(a);
}

$('.carousel').carousel();