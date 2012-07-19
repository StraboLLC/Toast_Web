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
		if (video.canPlayType('video/webm')) video.src = 'http://s3.amazonaws.com/dev.toast.data/' + captureElement.token + "/" + captureElement.token + ".webm";
		else if (video.canPlayType('video/mp4')) video.src = 'http://s3.amazonaws.com/dev.toast.data/' + captureElement.token + "/" + captureElement.token + ".mp4";
		else if (video.canPlayType('video/quicktime')) video.src = 'http://s3.amazonaws.com/dev.toast.data/' + captureElement.token + "/" + captureElement.token + ".mov";
		else video.innerHTML = "Sorry, your browser can't play HTML5 Video. Please try downloading <a href='http://google.com/chrome'>Google Chrome</a>";
	} else if (captureElement.mediaType === "photo") {
		photo.innerHTML = '<img src="http://s3.amazonaws.com/dev.toast.data/' + captureElement.token + "/" + captureElement.token + '.jpg" alt="">';
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
	var UP = 38;
	var DOWN = 40;
	var SPACEBAR = 32;
	var F = 70;
	var M = 77;
	var B = 66;
	document.onkeydown = function(e) {
		var keyCode = e.which;
		if (keyCode === RIGHT) {
			if (currentIndex < album.captures.length - 1) {
				currentIndex++;
				reloadCapture();
			}
		} else if (keyCode === LEFT) {
			if (currentIndex > 0) {
				currentIndex--;
				reloadCapture();
			}
		} else if (keyCode === UP) {
			map.zoomIn();
		} else if (keyCode === DOWN) {
			map.zoomOut();
		} else if (keyCode === SPACEBAR && $(video).hasClass('showing')) {
			if(video.paused) {
				play();
			} else {
				pause();
			}
		} else if (keyCode === F) {
			$(document.body).removeClass('map-fullscreen');
			if($(document.body).hasClass('fullscreen')) {
				$(document.body).removeClass('fullscreen');
			} else {
				$(document.body).addClass('fullscreen');
			}
			window.setTimeout(function() {
				map.invalidateSize();
			}, 150);
		} else if (keyCode === M) {
			$(document.body).removeClass('fullscreen');
			if($(document.body).hasClass('map-fullscreen')) {
				$(document.body).removeClass('map-fullscreen');
			} else {
				$(document.body).addClass('map-fullscreen');
			}
			window.setTimeout(function() {
				map.invalidateSize();
			}, 150);
		} else if (keyCode === B) {
			$(document.body).removeClass('fullscreen');
			$(document.body).removeClass('map-fullscreen');
			if($(document.body).hasClass('browse')) {
				$(document.body).removeClass('browse');
			} else {
				$(document.body).addClass('browse');
			}
			window.setTimeout(function() {
				map.invalidateSize();
			}, 150);
		}
	}
}

function reloadCapture() {
	// if(capture) capture.destroy();
	capture = album.getCapture(currentIndex);
	api.getGeoData(capture, capture.token);
	loadViewer(capture);
}
// Define the map to use from MapBox
// This is the TileJSON endpoint copied from the embed button on your map
$(document).ready(function() {
	initializeDomVariables();
	album = new ToastAlbum();

	// Make a new Leaflet map in your container div
	map = new L.Map('map-box', {
		minZoom: 2,
		maxZoom:17
	}).setView(new L.LatLng(38.9, -77.035), 10);
    // var openCycleMapLandscapeLayer = new L.TileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png', {maxZoom: 17});
    // map.addLayer(openCycleMapLandscapeLayer);
    var openCycleMapCycleLayer = new L.TileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {maxZoom: 17});	
    map.addLayer(openCycleMapCycleLayer);
    console.log('hi');
    // var topOsmReliefLayer = new L.TileLayer('http://{s}.tile.stamen.com/toposm-color-relief/{z}/{x}/{y}.jpg', {maxZoom: 17});	
    // map.addLayer(topOsmReliefLayer);
    // var topOsmContourLayer = new L.TileLayer('http://{s}.tile.stamen.com/toposm-contours/{z}/{x}/{y}.jpg', {maxZoom: 17});
    // map.addLayer(topOsmContourLayer);
	// var stamenLayer = new L.StamenTileLayer("terrain");
	// map.addLayer(stamenLayer);

	// // Get metadata about the map from MapBox
	// wax.tilejson('http://a.tiles.mapbox.com/v3/strabo.map-e5dtmwjx.jsonp', function(tilejson) {
	// 	map.addLayer(new wax.leaf.connector(tilejson));
	// });
	api.getAlbumCaptures(map, album, document.getElementById('album-token').innerHTML)
	initializeListeners();
	initializeKeyboardListeners();
    

	$('.capture-preview').click(function() {
		currentIndex = this.getAttribute('data-index');
		reloadCapture();
		$(document.body).removeClass('browse');
	});
});