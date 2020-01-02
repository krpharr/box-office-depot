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