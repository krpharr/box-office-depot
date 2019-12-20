function queryGeoLocation(){
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=23228&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
    });
}