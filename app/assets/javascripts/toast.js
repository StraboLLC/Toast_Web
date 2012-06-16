function Toast(obj) {



	this.api = new ToastAPI();
	this.viewer = obj.viewer;

	// Create Child Elements
	this.video = document.createElement('video');
	this.video.setAttribute('id', 'toast-video');
	this.video.setAttribute('class', 'toast-video');
	this.video.setAttribute('controls', 'controls');
	this.viewer.appendChild(this.video);
	this.photo = document.createElement('div');
	this.photo.setAttribute('id', 'toast-photo');
	this.photo.setAttribute('class', 'toast-photo');
	this.viewer.appendChild(this.photo);
	this.note = document.createElement('div');
	this.note.setAttribute('id', 'toast-note');
	this.note.setAttribute('class', 'toast-note');
	this.viewer.appendChild(this.note);
	this.audio = document.createElement('audio');
	this.audio.setAttribute('id', 'toast-audio');
	this.audio.setAttribute('class', 'toast-audio');
	this.viewer.appendChild(this.audio);

	// Initialize Listeners
	this.video.addEventListener("timeupdate", this.updateMap, false);
	this.video.addEventListener("ended", this.reset, false);
	this.video.addEventListener("seeking", this.scrubMap, false);
	this.video.addEventListener("seeked", this.scrubMap, false);
	this.photo.addEventListener("click", this.fullscreenMode, false);



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

	this.album = new ToastAlbum();
	this.api.getAlbumCaptures(this.album, obj.token)

	// Make a new Leaflet map in your container div
	this.map = new L.Map(obj.map, {
		minZoom: 2
	}).setView(new L.LatLng(38.9, -77.035), 15);
	var aMap = this.map;
	// Get metadata about the map from MapBox
	wax.tilejson('http://a.tiles.mapbox.com/v3/strabo.map-e5dtmwjx.jsonp', function(tilejson) {
		aMap.addLayer(new wax.leaf.connector(tilejson));
	});
}
Toast.prototype.play = function() {
	console.log("Play");
	video.play();
}
Toast.prototype.pause = function() {
	console.log("Pause");
	video.pause();
}
Toast.prototype.reset = function() {
	video.pause();
	capture.currentPoint = 0;
}
Toast.prototype.scrubMap = function() {
	this.capture.getPointByTime(video.currentTime)
	this.capture.marker.setLatLng(new L.LatLng(capture.points[capture.currentPoint].latitude, capture.points[capture.currentPoint].longitude));
	this.capture.marker.setIconAngle(Math.round((capture.points[capture.currentPoint].heading - 180) % 360));
}
Toast.prototype.loadViewer = function() {
	this.setViewerMode(this.capture.mediaType);
	if (this.capture.mediaType === "video") {
		if (this.video.canPlayType('video/webm')) this.video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + this.capture.token + "/" + this.capture.token + ".webm";
		else if (this.video.canPlayType('video/mp4')) this.video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + this.capture.token + "/" + this.capture.token + ".mp4";
		else if (this.video.canPlayType('video/quicktime')) this.video.src = 'http://s3.amazonaws.com/dev.toast.strabo/' + this.capture.token + "/" + this.capture.token + ".mov";
		else this.video.innerHTML = "Sorry, your browser can't play HTML5 Video. Please try downloading <a href='http://google.com/chrome'>Google Chrome</a>";
	} else if (this.capture.mediaType === "photo") {
		this.photo.innerHTML = '<img src="http://s3.amazonaws.com/dev.toast.strabo/' + this.capture.token + "/" + this.capture.token + '.jpg" alt="">';
	} else if (this.capture.mediaType === "note") {

	} else if (this.capture.mediaType === "audio") {

	}
}
Toast.prototype.setViewerMode = function(string) {
	if (string == "video") {
		$(this.video).addClass('showing');
		$(this.note).removeClass('showing');
		$(this.audio).removeClass('showing');
		$(this.photo).removeClass('showing');
	}
	if (string == "audio") {
		$(this.audio).addClass('showing');
		$(this.note).removeClass('showing');
		$(this.video).removeClass('showing');
		$(this.photo).removeClass('showing');
	}
	if (string == "note") {
		$(this.note).addClass('showing');
		$(this.video).removeClass('showing');
		$(this.audio).removeClass('showing');
		$(this.photo).removeClass('showing');
	}
	if (string == "photo") {
		$(this.photo).addClass('showing');
		$(this.note).removeClass('showing');
		$(this.audio).removeClass('showing');
		$(this.video).removeClass('showing');
	}
}
Toast.prototype.loadCapture = function(element) {
	var captureElement = this.capture;
	var aToast = this;
	loadCapture(element, captureElement);

	function loadCapture(element, captureElement) {
		var media_type = element.getAttribute('data-type');
		var token = element.getAttribute('data-token');
		if (captureElement) {
			captureElement.destroy();
		}
		aToast.capture = aToast.album.getCaptureByToken(token);
		aToast.api.getGeoData(captureElement, token);
		aToast.loadViewer(captureElement);
	}
};