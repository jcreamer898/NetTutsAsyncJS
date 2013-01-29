(function( $, GMaps ) {

var self = this,
    fromAddress = "1800 Pennsylvania Avenue, Washington D.C., DC",
    toAddress = "Empire State Building, 5th Avenue, New York, NY";

var MapFns = function( map ) {
    this.map = map;
};

_.extend( MapFns.prototype, {
    getDirections: function( fromAddress, toAddress ) {
        var self = this;
        
        $.when( this.geoCode( fromAddress ), this.geoCode( toAddress ) )
            .then(function( fromLatLng, toLatLng ) {
                self.getRoute( fromLatLng, toLatLng ).then( _.bind( self.routeDone, self ) );
            });
    },
    geoCode: function( address ) {
        var dfd = new $.Deferred();

        GMaps.geocode({
            address: address,
            callback: function( results, status ) {
                if ( status === "OK" )  {
                    return dfd.resolve( results[0].geometry.location );
                }
                return dfd.resolve( null, status );
            }
        });

        return dfd.promise();
    },

    getRoute: function( fromLatLng, toLatLng ) {
        var dfd = new $.Deferred();

        this.addMarker( fromLatLng );
        this.addMarker( toLatLng );

        this.map.getRoutes({
            origin: [ fromLatLng.lat(), fromLatLng.lng() ],
            destination: [ toLatLng.lat(), toLatLng.lng() ],
            travelMode: "driving",
            unitSystem: "imperial",
            callback: function( e ) {
                return dfd.resolve( e, fromLatLng, toLatLng );
            }
        });

        return dfd.promise();
    },
    addMarker: function( latLng, title ) {
        this.map.addMarker({
            lat: latLng.lat(),
            lng: latLng.lng(),
            title: title
        });
    },
    routeDone: function( e, fromLatLng, toLatLng ) {
        var dirs = "", route;

        this.map.cleanRoute();
        this.map.fitZoom();
        
        route = new GMaps.Route({
            map: this.map,
            route: e[0],
            strokeColor: '#336699',
            strokeOpacity: 0.5,
            strokeWeight: 10
        });

        this.emit( "directions.done", {
            route: route,
            fromLatLng: fromLatLng,
            toLatLng: toLatLng
        });
    }
});

var buildRoute = function( data ) {
    var route = data.route,
        fromLatLng = data.fromLatLng,
        toLatLng = data.toLatLng, i, dirs;
    
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
};

Monologue.mixin( MapFns );

$(function() {
    var map = new GMaps({
        div: '#map',
        lat: -12.043333,
        lng: -77.028333
    });

    var mapFns = new MapFns( map );
    mapFns.on( "directions.done", buildRoute );
    mapFns.getDirections( fromAddress, toAddress );
});

}( jQuery, window.GMaps ));