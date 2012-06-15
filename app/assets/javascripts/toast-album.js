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
