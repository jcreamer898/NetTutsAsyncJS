var fromLatLng, toLatLng, self = this,
    fromAddress = "1800 Pennsylvania Avenue, Washington D.C., DC",
    toAddress = "Empire State Building, 5th Avenue, New York, NY";

$(function() {
    var map = new GMaps({
        div: '#map',
        lat: -12.043333,
        lng: -77.028333
    });

    GMaps.geocode({
        address: fromAddress,
        callback: function( results, status ) {
            if ( status == "OK" ) {
                fromLatLng = results[0].geometry.location;
                GMaps.geocode({
                    address: toAddress,
                    callback: function( results, status ) {
                        if ( status == "OK" ) {
                            toLatLng = results[0].geometry.location;

                            map.getRoutes({
                                origin: [ fromLatLng.lat(), fromLatLng.lng() ],
                                destination: [ toLatLng.lat(), toLatLng.lng() ],
                                travelMode: "driving",
                                unitSystem: "imperial",
                                callback: function( e ){
                                    console.log( "ANNNND FINALLY here's the directions..." );
                                    console.log( e );
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});