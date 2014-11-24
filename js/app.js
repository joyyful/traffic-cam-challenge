"use strict";

$(document).ready(function() {
    var mapElem = document.getElementById('map');

    //Sets given longitude & latitude as the center of map and zooms to 12
    var map = new google.maps.Map(mapElem, {
        center: {
            lat: 47.6,
            lng: -122.3
        },
        zoom: 12
    });

    var markers = [];
    var infoWindow = new google.maps.InfoWindow();

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            var cameraLocations = data;

            //Add a marker to each camera location
            data.forEach(function(camera) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude),
                    },
                    imageurl: camera.imageurl.url,
                    cameralabel: camera.cameralabel,
                    map: map
                });
                markers.push(marker);

                //When marker is clicked, pan to location and show label and camera feed image
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent('<p>'+marker.cameralabel+'</p><img src="'+ marker.imageurl+'"/>');
                    infoWindow.open(map, marker);
                    map.panTo(marker.getPosition());
                })
            });
        })

    $('#search').bind('search keyup', function() {
        var searchTerm = document.getElementById('search').value;

        //If search term matches label, then show the marker(s) on the map
        markers.forEach(function(camera) {
            if (camera.cameralabel.toLowerCase().indexOf(searchTerm.toLowerCase()) < 0) {
                camera.setMap(null);
            } else {
                camera.setMap(map);
            }
        });
    });
});