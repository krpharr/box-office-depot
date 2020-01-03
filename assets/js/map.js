$(document).ready(function() {
    var zipcode = JSON.parse(localStorage.getItem("bod-movies-by-zip"));
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
        let results = response;
        var location = {
            address: response.results[0].formatted_address,
            lat: response.results[0].geometry.location.lat,
            lng: response.results[0].geometry.location.lng
        };
        localStorage.setItem("bod-geo-location", JSON.stringify(location));
        initMap();
    }).fail(function() {
        //todo: alert("queryGeoLocation failed");
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
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');
    for (var i = 0, place; place = places[i]; i++) {
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
        let query = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${$(this).data("id")}&fields=name,rating,formatted_phone_number&key=AIzaSyAD8wycqgshyqwS8pWhA1GF8_7XoJPR8xA`;
        var request = {
            placeId: $(this).data("id"),
            fields: ['name', 'website', 'vicinity', 'formatted_phone_number', 'url', 'geometry']
        };
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, callback);

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                createMarker(place);
            }
        }
    });
}

function createMarker(place) {
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