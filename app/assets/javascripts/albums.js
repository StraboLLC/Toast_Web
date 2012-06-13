// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// Global Vars
var viewer;
var map;
var capture;
var api;
var video, note, photo, audio;
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
	capture.currentPoint=0;	
 }

function loadViewer(elt) {
	var media_type = elt.getAttribute('data-type');
	var token = elt.getAttribute('data-token');
	if (capture) capture.destroy();
	capture = new ToastCapture(media_type, token);
	setViewerMode(media_type);
	if (media_type === "video") {

		video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + token + "/" + token + ".webm";

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

function ToastCapture(media_type, token) {
	this.currentPoint = [0];
	this.media_type = media_type;
	this.token = token;
	this.points = null;
	api.getGeoData(this);
};
ToastCapture.prototype.setMap = function(map) {
	console.log(this.points[0].latitude + "," + this.points[0].longitude);
	this.startingLatLng = new L.LatLng(this.points[0].latitude, this.points[0].longitude);
	map.setView(this.startingLatLng, 15);
	this.marker = new L.Marker(this.startingLatLng);
	map.addLayer(this.marker);
};
ToastCapture.prototype.destroy = function() {
	this.removePolyline();
	this.removeMarker();
};
ToastCapture.prototype.drawPolyline = function() {
	this.latLngs=[];
	for(var x in this.points) {
		this.latLngs.push(new L.LatLng(this.points[x].latitude,this.points[x].longitude));
	}
	this.polyline=new L.Polyline(this.latLngs);
	map.addLayer(this.polyline);
};
ToastCapture.prototype.removePolyline = function() {
	map.removeLayer(this.polyline,{smoothFactor:2.0});
};
ToastCapture.prototype.removeMarker = function() {
	map.removeLayer(this.marker);
};
// Define the map to use from MapBox
// This is the TileJSON endpoint copied from the embed button on your map
$(document).ready(function() {
	api = new ToastAPI();
	viewer = document.getElementById('viewer-box');
	video = document.getElementById('video');
	video.controls="controls";
	photo = document.getElementById('photo');
	note = document.getElementById('note');
	audio = document.getElementById('audio');
	if (video.addEventListener) {
		video.addEventListener("timeupdate", followRoute, false);
	} else if (video.attachEvent) {
		video.attachEvent("ontimeupdate", followRoute);
	}
	if (video.addEventListener) {
		video.addEventListener("ended", reset, false);
	} else if (video.attachEvent) {
		video.attachEvent("ended", reset);
	}
	// Make a new Leaflet map in your container div
	map = new L.Map('map-box').setView(new L.LatLng(38.9, -77.035), 15);

	// Get metadata about the map from MapBox
	wax.tilejson('http://a.tiles.mapbox.com/v3/strabo.map-e5dtmwjx.jsonp', function(tilejson) {
		map.addLayer(new wax.leaf.connector(tilejson));
	});

	$('.capture-preview').click(function() {
		loadViewer(this);
	});
});

/**
 * Main Method that is called ontimeupdate. This determines if the video is finished playing or is still playing. If finished, this will set the video to pause() mode.
 * If the video is still playing, it will update the Scrub Bar, Marker Position as well as Marker Rotation.
 */

function followRoute() {
	var percentDone = 1;
	var pointTime;
	var cTime = video.currentTime;
	if (cTime > video.duration) { // If video is done.
		console.log('wtf');
		capture.currentPoint = 0;
		// $('#played').width((percentDone * 100) + "%");
		// $('#play-pause').css("background", "url('/build/images/play.png') center center no-repeat");
	} else {
		//console.log("Current Point: "+capture.currentPoint+" Max Point: "+tracks[cT].points.length);
		percentDone = cTime / video.duration;
		if (capture.currentPoint >= capture.points.length) capture.currentPoint = capture.points.length - 1;
		pointTime = capture.points[capture.currentPoint].timestamp;
		while (cTime > pointTime && capture.currentPoint < capture.points.length - 1) {
			//console.log("Current Point: "+capture.currentPoint+" Max Point: "+capture.points.length);
			capture.currentPoint++;
			pointTime = capture.points[capture.currentPoint].timestamp;
		}
		var deg = Math.round(capture.points[capture.currentPoint].heading) - 90;
		capture.marker.setLatLng(new L.LatLng(capture.points[capture.currentPoint].latitude, capture.points[capture.currentPoint].longitude));
		// domRotate($('#' + capture.filename + '-marker')[0], deg);
		// $('#played').width((percentDone * 100) + "%");
	}
}

function ToastAPI() {}
ToastAPI.prototype.getGeoData = function(captureElement) {
	var xhr;

	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!xhr) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				response = JSON.parse(xhr.responseText)
				if (response.err_num) {
					console.log("Error " + repsonse.err_num + " - " + response.err);
				} else {
					captureElement.points = response.points;
					captureElement.drawPolyline();
					captureElement.setMap(map);
				}
				console.log(captureElement);
			} else {
				console.log('There was a problem with the request.');
			}
		}
	};
	xhr.open('GET', '/api/geo_data?data_token=' + captureElement.token);
	xhr.send();

}