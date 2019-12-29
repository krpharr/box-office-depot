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

        // Use for loop to dynamically create a card for each movie
        var link = " http://image.tmdb.org/t/p/w185/"; // Add the poster path to this to get back the picture
        var poster = response.results[0].poster_path; // In a for loop, replace [0] with [i]
        $(".card").css("width", 200);
        $(".activator").attr("src", link + poster);
        $(".activator").css("width", 200);

        // Changing the text of card-title removes the i class "material-icons"
        // When dynamically creating, will need to do the title + the i class
        // $(".card-title").text(response.results[0].title);
        $(".card-title").css("width", 150);

        // Need to add id to <p> inside the div "card-reveal"
        // This way, I can select the correct element to change the text content of

        for (var i = 0; i < response.results.length; i++) {
            var poster = response.results[i].poster_path

            // var carouselItem = $("<a class='carousel-item'>");
            // $(".carousel").append(carouselItem);
            var card = $("<div class='card'>").attr("id", "card" + i);
            $("#now-playing-ID").append(card);

            var cardImageContainer = $("<div class='card-image waves-effect waves-block waves-light'>");
            var cardImage = $("<img class='activator'>").attr("src", link + poster).attr("id", "img" + i);
            cardImageContainer.append(cardImage);
            card.append(cardImageContainer);

            var cardContent = $("<div class='card-content'>");
            card.append(cardContent);
            var cardTitle = $("<span>").text(response.results[i].title);
            cardTitle.addClass("card-title activator grey-text text-darken-4");
            cardContent.append(cardTitle);

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

getBoxOffice();

// Trying to get the close button to work within the card reveal

// $(document).click($("<i class='material-icons right'>").text("close"), function() {
//     console.log("i've been clicked")
//     $(".card-reveal").css("style", "display: none");
//     $(".card").css("style", "overflow: visible");
// })

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


////////////////////////////////
//  movies by zip showtimes search button event handler
//
$("#btn-movies-by-zip-ID").on("click", function(event) {
    event.preventDefault();
    // primitive validation
    if ($("#zipcode-input-ID").val() === "") {
        return;
    }
    // console.log($(this));
    let cbArray = $(this)[0].form.elements;
    // console.log(cbArray.length);
    let selMoviesTitleArray = [];
    for (let i = 0; i < cbArray.length; i++) {
        // console.log(cbArray[i].checked);
        if (cbArray[i].checked) selMoviesTitleArray.push($(cbArray[i]).data("title"));
    }
    // console.log(selMoviesIDArray);
    let saveData = {
        zip: $("#zipcode-input-ID").val(),
        titleArray: selMoviesTitleArray
    }
    localStorage.setItem("bod-search-showtimes-zip", JSON.stringify(saveData));
    window.location.href = "FindTheaters.html";
});