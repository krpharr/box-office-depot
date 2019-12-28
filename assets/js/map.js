// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


// !!!! does not work if user has grammerly running in chrome !!!!
var user_location = JSON.parse(localStorage.getItem("bod-zipcodeSearch"));

console.log(user_location);

var map;

function initMap() {
    // Create the map.
    var pyrmont = {
        lat: 37.540760,
        lng: -77.433929
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 17
    });
    // Create the places service.
    var service = new google.maps.places.PlacesService(map);
    var getNextPage = null;
    var moreButton = document.getElementById('more');
    moreButton.onclick = function() {
        moreButton.disabled = true;
        if (getNextPage) getNextPage();
    };
    // Perform a nearby search.
    service.nearbySearch({
            location: pyrmont,
            radius: 8046,
            type: ['movie_theater']
        },
        function(results, status, pagination) {
            if (status !== 'OK') return;
            createMarkers(results);
            moreButton.disabled = !pagination.hasNextPage;
            getNextPage = pagination.hasNextPage && function() {
                pagination.nextPage();
            };
        });
}

function createMarkers(places) {
    console.log("*********** createMarkers(places) ******************");
    console.log(places);
    // console.log("");
    // console.log("");
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');
    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });
        // create object for place data
        var theatre = {
            id: place.id,
            name: place.name,
            place_id: place.place_id,
            vicinity: place.vicinity
        };

        let container = $("<div>").data("ID", i);
        let name = $("<h5>").text(theatre.name);
        let address = $("<p>").text(theatre.vicinity);
        let id = $("<div>").text(theatre.id);
        let place_id = $("<div>").text(theatre.place_id);
        container.append(name, address, id, place_id);
        $("#theatre-info-element-ID").append(container);

        // create div with each place data
        var li = document.createElement('li');
        li.setAttribute("data-id", theatre.place_id);
        li.setAttribute("class", "theatre-name");
        li.textContent = place.name;
        placesList.appendChild(li);
        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);

    $(".theatre-name").on("click", function(event) {
        console.log(event.target);
        console.log($(this).data("id"));
        // let query = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${$(this).data("id")}&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
        // let query = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${$(this).data("id")}&fields=name,vicinity,opening_hours,website&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
        let query = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${$(this).data("id")}&fields=name,rating,formatted_phone_number&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
        // $.ajax({
        //     url: query,
        //     method: "GET"
        // }).then(function(response) {
        //     console.log(response);
        // });
        var request = {
            placeId: $(this).data("id"),
            fields: ['name', 'website', 'vicinity', 'formatted_phone_number', 'url']
        };

        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, callback);

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                // createMarker(place);
                console.log(place);
            }
        }

    });
}

$(document).ready(function() {

});