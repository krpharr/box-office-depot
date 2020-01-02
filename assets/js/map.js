// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


// !!!! does not work if user has grammerly running in chrome !!!!


$(document).ready(function() {
    var zipcode = JSON.parse(localStorage.getItem("bod-movies-by-zip"));

    console.log(zipcode);

    queryGeoLocation(zipcode);

});

var map;
var service;
var infowindow;


function queryGeoLocation(query) {
    var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response) {
        console.log(response);

        let results = response;
        console.log(response.results[0].formatted_address);
        console.log(response.results[0].geometry.location);

        var location = {
            address: response.results[0].formatted_address,
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng
        };
        console.log(location)

        localStorage.setItem("bod-geo-location", JSON.stringify(location));

        initMap();

    }).fail(function() {
        alert("queryGeoLocation failed");
    });

}


function initMap() {
    // Create the map.
    let geoLocation = JSON.parse(localStorage.getItem("bod-geo-location"));
    var pyrmont = {
        lat: geoLocation.lat,
        lng: geoLocation.lng
    };
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 1
    });

    // map.addListener('click', function(e) {
    //     console.log(e);
    // });

    // Create the places service.
    service = new google.maps.places.PlacesService(map);
    var getNextPage = null;
    var moreButton = document.getElementById('more');
    moreButton.onclick = function() {
        moreButton.disabled = true;
        if (getNextPage) getNextPage();
    };
    // Perform a nearby search.
    service.nearbySearch({
            location: pyrmont,
            radius: 20000,
            type: ['movie_theater']
        },
        function(results, status, pagination) {
            if (status !== 'OK') return;
            createMarkers(results);
            moreButton.disabled = !pagination.hasNextPage;
            getNextPage = pagination.hasNextPage && function() {
                pagination.nextPage();
            };
        }
    );

}

function createMarkers(places) {
    console.log("*********** createMarkers(places) ******************");
    console.log(places);
    // console.log("");
    // console.log("");
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');
    for (var i = 0, place; place = places[i]; i++) {
        console.log(place);
        // var image = {
        //     url: place.icon,
        //     size: new google.maps.Size(71, 71),
        //     origin: new google.maps.Point(0, 0),
        //     anchor: new google.maps.Point(17, 34),
        //     scaledSize: new google.maps.Size(25, 25)
        // };
        // var marker = new google.maps.Marker({
        //     map: map,
        //     icon: image,
        //     title: place.name,
        //     position: place.geometry.location
        // });

        createMarker(place);

        // create object for place data
        var theatre = {
            id: place.id,
            name: place.name,
            place_id: place.place_id,
            vicinity: place.vicinity
        };


        let container = $("<div>").data("ID", i);
        let name = $("<h5>").text(theatre.name);
        let address = $("<a>").text(theatre.vicinity);
        var str = "https://www.google.com/maps/place/";
        str += theatre.vicinity.replace(" ", "+");
        address.attr("href", str);
        address.attr("target", "_blank");
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
        let query = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${$(this).data("id")}&fields=name,rating,formatted_phone_number&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
        // $.ajax({
        //     url: query,
        //     method: "GET"
        // }).then(function(response) {
        //     console.log(response);
        // });
        var request = {
            placeId: $(this).data("id"),
            fields: ['name', 'website', 'vicinity', 'formatted_phone_number', 'url', 'geometry']
        };

        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, callback);

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                createMarker(place);
                console.log(place);
            }
        }

    });
}

function createMarker(place) {
    console.log("place", place);
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    var str = "https://www.google.com/maps/place/";
    str += place.vicinity.replace(" ", "+");
    google.maps.event.addListener(marker, 'click', function() {
        let content = `<div>${place.name}</div>
                        <div>${place.vicinity}</div>
                        <div><a href="${str}" target="_blank">Open in Google Maps!</a></div>`;
        infowindow.setContent(content);
        infowindow.open(map, this);
    });
}