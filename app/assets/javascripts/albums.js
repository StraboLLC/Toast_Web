// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.



// Define the map to use from MapBox
// This is the TileJSON endpoint copied from the embed button on your map
$(document).ready(function() {
	var url = 'http://a.tiles.mapbox.com/v3/strabo.map-e5dtmwjx.jsonp';

	// Make a new Leaflet map in your container div
	var map = new L.Map('map-box')  // container's id="mapbox"

	// Center the map on Washington, DC, at zoom 15
	.setView(new L.LatLng(38.9, -77.035), 15);

	// Get metadata about the map from MapBox
	wax.tilejson(url, function(tilejson) {
		map.addLayer(new wax.leaf.connector(tilejson));
	});

});