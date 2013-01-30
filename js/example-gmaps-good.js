(function( $, GMaps ) {

var fromLatLng, toLatLng, self = this, i,
    fromAddress = "1800 Pennsylvania Avenue, Washington D.C., DC",
    toAddress = "Empire State Building, 5th Avenue, New York, NY";

$(function() {
    var map = new GMaps({
        div: '#map',
        lat: -12.043333,
        lng: -77.028333
    });

    map.cleanRoute();

    function getFromAddress( results, status ) {
        if ( status == "OK" ) {
            fromLatLng = results[0].geometry.location;
            map.addMarker({
                lat: fromLatLng.lat(),
                lng: fromLatLng.lng(),
                title: "From"
            });
            GMaps.geocode({
                address: toAddress,
                callback: getToAddress
            });
        }
    }

    function getToAddress ( results, status ) {
        if ( status == "OK" ) {
            toLatLng = results[0].geometry.location;
            map.addMarker({
                lat: toLatLng.lat(),
                lng: toLatLng.lng(),
                title: "From"
            });
            map.getRoutes({
                origin: [ fromLatLng.lat(), fromLatLng.lng() ],
                destination: [ toLatLng.lat(), toLatLng.lng() ],
                travelMode: "driving",
                unitSystem: "imperial",
                callback: getRoute
            });
        }
    }

    function getRoute ( e ){
        console.log( "ANNNND FINALLY here's the directions..." );
        var dirs = "";
        map.cleanRoute();
        map.fitZoom();
        var route = new GMaps.Route({
            map: map,
            route: e[0],
            strokeColor: '#336699',
            strokeOpacity: 0.5,
            strokeWeight: 10
        });

        for( i = 0; i < route.steps_length; i++ ) {
            route.forward();
            dirs += '<li>' + route.steps[i].instructions +
                '<span class="dir-distance"> ' + route.steps[i].distance.text + '</span></li>';
        }

        map.drawRoute({
            origin: [fromLatLng.lat(), fromLatLng.lng()],
            destination: [toLatLng.lat(), toLatLng.lng()],
            travelMode: 'driving',
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 6
          });

        $( "#directions" ).append( dirs );
    }

    GMaps.geocode({
        address: fromAddress,
        callback: getFromAddress
    });
});

}( jQuery, window.GMaps ));