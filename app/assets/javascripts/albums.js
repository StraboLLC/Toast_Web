// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// Global Vars
//= require util
//= require capture
//= require toast-album
//= require toast2
var viewer;
var map;
var capture;
var api;
var video;
var note;
var photo;
var audio;
var album;
var currentIndex;

function play() {
	console.log("Play");
	video.play();
}

function pause() {
	console.log("Pause");
	video.pause();
}

function reset() {
	video.pause();
	capture.currentPoint = 0;
}

function loadViewer(captureElement) {
	setViewerMode(captureElement.mediaType);
	if (captureElement.mediaType === "video") {
		if (video.canPlayType('video/webm')) video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + captureElement.token + "/" + captureElement.token + ".webm";
		else if (video.canPlayType('video/mp4')) video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + captureElement.token + "/" + captureElement.token + ".mp4";
		else if (video.canPlayType('video/quicktime')) video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + captureElement.token + "/" + captureElement.token + ".mov";
		else video.innerHTML = "Sorry, your browser can't play HTML5 Video. Please try downloading <a href='http://google.com/chrome'>Google Chrome</a>";
	} else if (captureElement.mediaType === "photo") {
		photo.innerHTML = '<img src="http://s3.amazonaws.com/dev.toast.strabo/' + captureElement.token + "/" + captureElement.token + '.jpg" alt="">';
	} else if (captureElement.mediaType === "note") {

	} else if (captureElement.mediaType === "audio") {

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

function createViewerChildren(element) {
	video = document.createElement('video');
	video.setAttribute('id', 'toast-video');
	video.setAttribute('class', 'toast-video');
	video.setAttribute('controls', 'controls');
	element.appendChild(video);
	photo = document.createElement('div');
	photo.setAttribute('id', 'toast-photo');
	photo.setAttribute('class', 'toast-photo');
	element.appendChild(photo);
	note = document.createElement('div');
	note.setAttribute('id', 'toast-note');
	note.setAttribute('class', 'toast-note');
	element.appendChild(note);
	audio = document.createElement('audio');
	audio.setAttribute('id', 'toast-audio');
	audio.setAttribute('class', 'toast-audio');
	element.appendChild(audio);
}

function initializeDomVariables() {
	api = new ToastAPI();
	viewer = document.getElementById('viewer-box');
	createViewerChildren(viewer);
}

function initializeListeners() {
	video.addEventListener("timeupdate", updateMap, false);
	video.addEventListener("ended", reset, false);
	video.addEventListener("seeking", scrubMap, false);
	video.addEventListener("seeked", scrubMap, false);
	photo.addEventListener("click", fullscreenMode, false);
}

function fullscreenMode() {

}

function scrubMap() {
	capture.getPointByTime(video.currentTime)
	capture.setCurrentPoint(capture.currentPoint);
}

function updateMap() {
	if (capture.points != null) {
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
			capture.setCurrentPoint(capture.currentPoint);
		}
	}
}

function initializeKeyboardListeners() {
	var RIGHT = 39;
	var LEFT = 37;
	document.onkeydown = function(e) {
		var keyCode = e.which;
		console.log(keyCode);
		if (keyCode === RIGHT) {
			if (currentIndex < album.captures.length - 1) {
				console.log("Right");
				currentIndex++;
				reloadCapture();
			}
		} else if (keyCode === LEFT) {
			console.log("Left");
			if (currentIndex > 0) {
				currentIndex--;
				reloadCapture();
			}
		}
	}
}

function reloadCapture() {
	capture.destroy();
	capture = album.captures[currentIndex];
	api.getGeoData(capture, capture.token);
	loadViewer(capture);
}
// Define the map to use from MapBox
// This is the TileJSON endpoint copied from the embed button on your map
$(document).ready(function() {
	initializeDomVariables();
	album = new ToastAlbum();
	api.getAlbumCaptures(album, document.getElementById('album-token').innerHTML)
	initializeListeners();
	initializeKeyboardListeners();
	// Make a new Leaflet map in your container div
	map = new L.Map('map-box', {
		minZoom: 2
	}).setView(new L.LatLng(38.9, -77.035), 15);

	// Get metadata about the map from MapBox
	wax.tilejson('http://a.tiles.mapbox.com/v3/strabo.map-e5dtmwjx.jsonp', function(tilejson) {
		map.addLayer(new wax.leaf.connector(tilejson));
	});

	$('.capture-preview').click(function() {
		var media_type = this.getAttribute('data-type');
		var token = this.getAttribute('data-token');
		currentIndex = this.getAttribute('data-index');
		if (capture) {
			capture.destroy();
		}
		capture = album.captures[currentIndex];
		api.getGeoData(capture, capture.token);
		loadViewer(capture);
	});
});