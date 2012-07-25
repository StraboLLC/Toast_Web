function ToastAlbum() {}
ToastAlbum.prototype.set = function(obj) {
	this.token = obj.token;
	this.cover = obj.album.cover;
	this.id = obj.album.id;
	this.name = obj.album.name;
	this.public = obj.album.public;
	this.uploadedAt = new Date(obj.album.created_at);
	this.takenAt = new Date(obj.album.taken_at);
	this.updatedAt = new Date(obj.album.updated_at);
	this.userId = obj.album.user_id;
	this.captures = [];
	for (x in obj.captures) {
		this.captures.push(new ToastCapture(obj.captures[x]));
	}
	this.bounds = new L.LatLngBounds();

	this.clusterer = new L.MarkerClusterGroup();
	L.MarkerClusterDefault.bindEvents(map, this.clusterer);


	for (x in this.captures) {
		console.log(this.captures[x]);
		this.captures[x].startingLatLng = new L.LatLng(this.captures[x].latitude, this.captures[x].longitude);
		this.bounds.extend(this.captures[x].startingLatLng);
		this.captures[x].marker = new L.Marker(this.captures[x].startingLatLng);
		this.captures[x].marker.setIconAngle(this.captures[x].heading);
		this.captures[x].marker.addEventListener("click", function() {
			ToastAPI.getGeoData(this.captures[x], this.captures[x].token);
			loadViewer(this.captures[x]);
		});
		// map.addLayer(this.captures[x].marker);
		this.clusterer.addLayer(this.captures[x].marker);
	}
	map.addLayer(this.clusterer);


}
ToastAlbum.prototype.getCapture = function(index) {
	return this.captures[index];
}
ToastAlbum.prototype.getCaptureByToken = function(token) {
	var capture;
	for (x in this.captures) {
		if (this.captures[x].token === token) {
			capture = this.captures[x];
		}
	}
	return capture;
};