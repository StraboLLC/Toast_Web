// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// Global Vars
//= require util
//= require capture
//= require toast-album
var viewer;
var map;
var capture;
var api;
var video, note, photo, audio;
var album;
/**
 * Simple abstraction method that plays the video from the current position.
 */

 function play() {
 	console.log("Play");
 	video.play();
	// $('#play-pause').css("background", "url('/build/images/pause.png') center center no-repeat");
}
/**
 * Pauses the video and track playback without losing the current position in playback.
 */

 function pause() {
 	console.log("Pause");
 	video.pause();
	// $('#play-pause').css("background", "url('/build/images/play.png') center center no-repeat");
}
/**
 *
 */

 function reset() {
 	video.pause();
 	capture.currentPoint = 0;
 }

 function loadViewer(captureElement) {
 	setViewerMode(captureElement.mediaType);
 	if (captureElement.mediaType === "video") {
 		video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + captureElement.token + "/" + captureElement.token + ".webm";
 	}
 }

 function setViewerMode(string) {
 	if (string == "video") {
 		$(video).addClass('showing');
 		$(note).removeClass('showing');
 		$(audio).removeClass('showing');
 		$(photo).removeClass('showing');
 	}
 	if (string == "audio") {
 		$(audio).addClass('showing');
 		$(note).removeClass('showing');
 		$(video).removeClass('showing');
 		$(photo).removeClass('showing');
 	}
 	if (string == "note") {
 		$(note).addClass('showing');
 		$(video).removeClass('showing');
 		$(audio).removeClass('showing');
 		$(photo).removeClass('showing');
 	}
 	if (string == "photo") {
 		$(photo).addClass('showing');
 		$(note).removeClass('showing');
 		$(audio).removeClass('showing');
 		$(video).removeClass('showing');
 	}
 }

 function initializeDomVariables() {
 	api = new ToastAPI();
 	viewer = document.getElementById('viewer-box');
 	video = document.getElementById('video');
 	video.controls = "controls";
 	photo = document.getElementById('photo');
 	note = document.getElementById('note');
 	audio = document.getElementById('audio');
 }

 function initializeListeners() {
 	if (video.addEventListener) {
 		video.addEventListener("timeupdate", updateMap, false);
 	} else if (video.attachEvent) {
 		video.attachEvent("ontimeupdate", updateMap);
 	}
 	if (video.addEventListener) {
 		video.addEventListener("ended", reset, false);
 	} else if (video.attachEvent) {
 		video.attachEvent("onended", reset);
 	}	
 	if (video.addEventListener) {
 		video.addEventListener("seeking", scrubMap, false);
 	} else if (video.attachEvent) {
 		video.attachEvent("onseeking", scrubMap);
 	}	
 	if (video.addEventListener) {
 		video.addEventListener("seeked", scrubMap, false);
 	} else if (video.attachEvent) {
 		video.attachEvent("onseeked", scrubMap);
 	}	
 }
// Define the map to use from MapBox
// This is the TileJSON endpoint copied from the embed button on your map
$(document).ready(function() {
	initializeDomVariables();
	album = new ToastAlbum();
	api.getAlbumCaptures(album,document.getElementById('album-token').innerHTML)
	initializeListeners();

	// Make a new Leaflet map in your container div
	map = new L.Map('map-box', {
		minZoom : 2
	}).setView(new L.LatLng(38.9, -77.035), 15);

	// Get metadata about the map from MapBox
	wax.tilejson('http://a.tiles.mapbox.com/v3/strabo.map-e5dtmwjx.jsonp', function(tilejson) {
		map.addLayer(new wax.leaf.connector(tilejson));
	});

	$('.capture-preview').click(function() {
		var media_type = this.getAttribute('data-type');
		var token = this.getAttribute('data-token');
		if (capture) {
			capture.destroy();
		}
		capture = album.getCaptureByToken(token);
		api.getGeoData(capture,token);
		loadViewer(capture);
	});
});
function scrubMap() {
	capture.getPointByTime(video.currentTime)
	capture.marker.setLatLng(new L.LatLng(capture.points[capture.currentPoint].latitude, capture.points[capture.currentPoint].longitude));
	//var deg = Math.round(capture.points[capture.currentPoint].heading) - 90;
}
function updateMap() {
	if(capture.points!=null) {
		var percentDone = 1;
		var pointTime;
		var cTime = video.currentTime;
		if (cTime > video.duration) { // If video is done.
			console.log('wtf');
			capture.currentPoint = 0;
		} else {
			percentDone = cTime / video.duration;
			if (capture.currentPoint >= capture.points.length) capture.currentPoint = capture.points.length - 1;
			pointTime = capture.points[capture.currentPoint].timestamp;
			while (cTime > pointTime && capture.currentPoint < capture.points.length - 1) {
				capture.currentPoint++;
				pointTime = capture.points[capture.currentPoint].timestamp;
			}
			var deg = Math.round(capture.points[capture.currentPoint].heading) - 90;
			capture.marker.setLatLng(new L.LatLng(capture.points[capture.currentPoint].latitude, capture.points[capture.currentPoint].longitude));
		}
	}
}