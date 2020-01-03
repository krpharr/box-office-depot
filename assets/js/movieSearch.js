////////////////////////////   This code needs to be attached, on click, when searching for a movie ////////// 
// Ajax function for OMDb call
function getMovie() {
    event.preventDefault();
    // var queryURL = "https://www.omdbapi.com/?t=avengers&apikey=e2a8b4bf&";
    // Declaring the url, depending on the title search input
    // placeHolder being = input value
    var searchedMovie = $("#searchedMovie").val();
    console.log("-------");
    console.log(searchedMovie);
    var queryURL = "https://www.omdbapi.com/?t=" + searchedMovie + "&apikey=e2a8b4bf&";

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
        var searchImg = $("<img id='searchImg'>").attr("src", response.Poster);
        var searchContent = $("<div class='card-content' id='searchContent'>");

        $(".movieContainer").append(searchCard);
        searchCard.append(searchImgContainer);
        searchImgContainer.append(searchImg);
        searchCard.append(searchContent);

        searchContent.append($("<h4>").text(response.Title));
        searchContent.append($("<p class='searchP'>").text("Released: " + response.Released));
        searchContent.append($("<p class='searchP'>").text(response.Rated));
        searchContent.append($("<p class='searchP'>").text(response.Plot));
        searchContent.append($("<p class='searchP'>").text("Box Office: " + response.BoxOffice));


        searchContent.append($("<p>").text(response.Ratings[1].Source + ": " + response.Ratings[1].Value));
    })
}

$("#movieSearchBtn").on("click", function() {
    $(".movieContainer").empty();
    getMovie();
})