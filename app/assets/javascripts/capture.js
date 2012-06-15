/**
 * Stores information relating to a user's capture.
 * @param {Object} obj An object returned from the server.
 */

function ToastCapture(obj) {
	this.currentPoint = 0;
	this.albumId = obj.album_id;
	this.createdAt = new Date(obj.created_at);
	this.description = obj.description;
	this.encodingFinished = obj.encoding_finished;
	this.id = obj.id;
	this.jobId = obj.job_id;
	this.latitude = obj.latitude;
	this.longitude = obj.longitude;
	this.mediaType = obj.media_type;
	this.mp4Finished = obj.mp4_finished;
	this.mp4Id = obj.mp4_id;
	this.orientation = obj.orientation;
	this.takenAt = new Date(obj.taken_at);
	this.title = obj.title;
	this.token = obj.token;
	this.updatedAt = new Date(obj.updated_at);
	this.webmFinished = obj.webm_finished;
	this.webmId = obj.webm_id;
	this.points = null;
};

ToastCapture.prototype.setMap = function(map) {
	this.startingLatLng = new L.LatLng(this.points[0].latitude, this.points[0].longitude);
	map.setView(this.startingLatLng, 15);
	this.marker = new L.Marker(this.startingLatLng);
	map.addLayer(this.marker);
};
ToastCapture.prototype.destroy = function() {
	this.removePolyline();
	this.removeMarker();
};

ToastCapture.prototype.drawPolyline = function(map) {
	this.latLngs = [];
	for (var x in this.points) {
		this.latLngs.push(new L.LatLng(this.points[x].latitude, this.points[x].longitude));
	}
	this.polyline = new L.Polyline(this.latLngs);
	map.addLayer(this.polyline);
};
ToastCapture.prototype.removePolyline = function() {
	map.removeLayer(this.polyline, {
		smoothFactor: 2.0
	});
};
ToastCapture.prototype.removeMarker = function() {
	map.removeLayer(this.marker);
};

ToastCapture.prototype.draw = function(map) {
	this.setMap(map);
	this.drawPolyline(map);
};

ToastCapture.prototype.getPointByTime = function(timestamp,head,tail) {
	head = head || 0;
	tail = tail || this.points.length;
	var midpoint = parseInt((tail + head)/2);
	var length = tail - head;
	if(length<=1) {
		this.currentPoint = midpoint;
	} else if(timestamp == this.points[midpoint].timestamp) {
		this.currentPoint = midpoint;
	} else if(timestamp > this.points[midpoint].timestamp) {
		this.getPointByTime(timestamp,midpoint,tail);
	} else if(timestamp < this.points[midpoint].timestamp) {
		this.getPointByTime(timestamp,head,midpoint);
	}
};










