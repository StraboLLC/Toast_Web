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
	this.heading = obj.heading;
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

ToastCapture.prototype.drawMarker = function(map) {
	this.startingLatLng = new L.LatLng(this.points[0].latitude, this.points[0].longitude);
	map.setView(this.startingLatLng, map.getZoom());
	this.marker.setLatLng(this.startingLatLng);
	this.marker.setIconAngle(Math.round((this.points[0].heading)));
	// map.addLayer(this.marker);
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
	this.polyline = new L.Polyline(this.latLngs, {
		color:"#DB6C4D"
	});
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
	this.drawMarker(map)
	this.drawPolyline(map);
};

ToastCapture.prototype.getPointByTime = function(timestamp, head, tail) {
	head = head || 0;
	tail = tail || this.points.length;
	var midpoint = parseInt((tail + head) / 2);
	var length = tail - head;
	if (length <= 1) {
		this.currentPoint = midpoint;
	} else if (timestamp == this.points[midpoint].timestamp) {
		this.currentPoint = midpoint;
	} else if (timestamp > this.points[midpoint].timestamp) {
		this.getPointByTime(timestamp, midpoint, tail);
	} else if (timestamp < this.points[midpoint].timestamp) {
		this.getPointByTime(timestamp, head, midpoint);
	}
};
ToastCapture.prototype.setCurrentPoint = function(currentPoint) {
	this.currentPoint = currentPoint;
	var currentAngle = this.marker.getIconAngle();
	var nextAngle= Math.round(this.points[this.currentPoint].heading);
	var delta = (nextAngle-currentAngle);
	if(delta>180) {
		delta-=360;
	}
	this.marker.setIconAngle(currentAngle+delta);
	this.marker.setLatLng(new L.LatLng(this.points[this.currentPoint].latitude, this.points[this.currentPoint].longitude));
};