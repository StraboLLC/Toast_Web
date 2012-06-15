/**
 * A Utility Class for Working with the Toast API.
 */

function ToastAPI() {}
ToastAPI.prototype.getGeoData = function(captureElement, token) {
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
		console.error("Could't create XMLHttpRequest.");
		return false;
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				response = JSON.parse(xhr.responseText)
				if (response.err_num) {
					console.log("Error " + repsonse.err_num + " - " + response.err);
				} else {
					captureElement.points=response.points;
					captureElement.draw(map);
				}
			} else {
				console.log('There was a problem with the request.');
			}
		}
	};
	xhr.open('GET', '/api/geo_data?data_token=' + token);
	xhr.send();

}
ToastAPI.prototype.getAlbumCaptures = function(albumElement, token) {
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
		console.error("Could't create XMLHttpRequest.");
		return false;
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var response = JSON.parse(xhr.responseText)
				if (response.err_num) {
					console.log("Error " + repsonse.err_num + " - " + response.err);
				} else {
					albumElement.set(response);
				}
			} else {
				console.log('There was a problem with the request.');
			}
		}
	};
	xhr.open('GET', '/api/album_captures?data_token=' + token);
	xhr.send();
};