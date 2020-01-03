
// Ajax function for OMDb call
function getMovie() {
    event.preventDefault();

    var searchedMovie = $("#searchedMovie").val();
    var queryURL = "https://www.omdbapi.com/?t=" + searchedMovie + "&apikey=e2a8b4bf&";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        // Below will create a horizontal card
        // This card will display the movie image, title, release date, rated, plot, Rotten Tomato score, and Box Office data
        var searchCard = $("<div class='card horizontal' id='searchCard-ID'>");
        var searchImgContainer = $("<div class='card-image'>");
        var searchImg = $("<img id='searchImg'>").attr("src", response.Poster);
        var searchContent = $("<div class='card-content' id='searchContent'>");

        $(".movieContainer").append(searchCard);
        searchCard.append(searchImgContainer);
        searchImgContainer.append(searchImg);
        searchCard.append(searchContent);

        searchContent.append($("<h4>").text(response.Title));
        searchContent.append($("<p class='searchP'>").text("Released: " + response.Released));
        searchContent.append($("<p class='searchP'>").text("Rated: " + response.Rated));
        searchContent.append($("<p class='searchP'>").text(response.Plot));
        searchContent.append($("<p class='searchP'>").text("Box Office: " + response.BoxOffice));


        searchContent.append($("<p>").text(response.Ratings[1].Source + ": " + response.Ratings[1].Value));
    })
}

$("#movieSearchBtn").on("click", function() {
    $(".movieContainer").empty();
    getMovie();
})