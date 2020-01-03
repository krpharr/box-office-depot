var ajaxSuccess = false;

function comingSoon() {

    var queryURL = "https://api.themoviedb.org/3/movie/upcoming?api_key=a5366a149888ef9fe65c9fedceb22b79&region=US";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        // Declaring the link as a variable, to call in the for loop with the path
        // This is for pulling the movie poster
        var link = " https://image.tmdb.org/t/p/w185/";

        $(".card").css("width", 200);
        $(".activator").attr("src", link + poster);
        $(".activator").css("width", 200);
        $(".card-title").css("width", 150);

        for (var i = 0; i < response.results.length; i++) {
            var poster = response.results[i].poster_path

            // In cases where the poster path has a value of null, a card will no be created
            if (poster !== null) {

                // Creating a Materialize card for each movie in the ajax response
                var card = $("<div class='card topCard'>").attr("id", "card" + i);
                $("#coming-soon-ID").append(card);

                // Putting the image in the card, using Materialize classes
                var cardImageContainer = $("<div class='card-image waves-effect waves-block waves-light'>");
                var cardImage = $("<img class='activator'>").attr("src", link + poster).attr("id", "img" + i);
                cardImageContainer.append(cardImage);
                card.append(cardImageContainer);

                // Putting the movie title in the card, using Materialize classes
                var cardContent = $("<div class='card-content'>");
                card.append(cardContent);
                var cardTitle = $("<span>").text(response.results[i].title);
                cardTitle.addClass("card-title activator grey-text text-darken-4");
                cardContent.append(cardTitle);

                // Creating the "reveal" on click, to display the movie synopsis.
                var cardReveal = $("<div class='card-reveal'>").css("style", "display: block");
                card.append(cardReveal);
                var closeBtn = $("<i class='material-icons right'>").text("close");
                var cardRevealTitle = $("<span>").text(response.results[i].title).append(closeBtn);
                cardRevealTitle.addClass("card-title grey-text text-darken-4");
                cardReveal.append(cardRevealTitle);
                var cardRevealInfo = $("<p>").text(response.results[i].overview);
                cardReveal.append(cardRevealInfo);
            }
        }
        ajaxSuccess = true;
    })
}

$("#coming-soon-ID").hide();
comingSoon();

$(document).ready(function() {
    let interval = setInterval(function() {
        console.log(ajaxSuccess);
        if (ajaxSuccess) {
            clearInterval(interval);
            $("#top-rated-loader").hide();
            $("#coming-soon-ID").show();
        }
    }, 10);
});