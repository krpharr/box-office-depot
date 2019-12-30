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
        var link = " http://image.tmdb.org/t/p/w185/"; // Add the poster path to this to get back the picture
        var poster = response.results[0].poster_path; // In a for loop, replace [0] with [i]
        $(".card").css("width", 200);
        $(".activator").attr("src", link + poster);
        $(".activator").css("width", 200);

        // Changing the text of card-title removes the i class "material-icons"
        // When dynamically creating, will need to do the title + the i class
        // $(".card-title").text(response.results[0].title);
        $(".card-title").css("width", 150);

        for (var i = 0; i < response.results.length; i++) {
            console.log(response.results.length);
            var poster = response.results[i].poster_path
            if (poster !== null) {

            // var carouselItem = $("<a class='carousel-item'>");
            // $(".carousel").append(carouselItem);
            // Try adding the href and set it equal to #[i]!
            // Not sure it will work, but try
            var card = $("<div class='card'>").attr("id", "card" + i);
            $("#coming-soon-ID").append(card);

            var cardImageContainer = $("<div class='card-image waves-effect waves-block waves-light'>");
            var cardImage = $("<img class='activator'>").attr("src", link + poster).attr("id", "img" + i);
            cardImageContainer.append(cardImage);
            card.append(cardImageContainer);

            // Make the text content for the title smaller
            // Also add the scores from rotten tomatoes?
            // Do we want to display the release date?
            // Perhaps add the release date to the reveal tab
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
        }
    })
}

comingSoon();