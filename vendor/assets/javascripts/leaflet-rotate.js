var RotateMarker = L.Marker.extend({
	_reset: function() {
		var pos = this._map.latLngToLayerPoint(this._latlng).round();

		L.DomUtil.setPosition(this._icon, pos);
		if (this._shadow) {
			this._shadow.style.display="none";
			//L.DomUtil.setPosition(this._shadow, pos);
		}

		if (this.options.iconAngle) {
			this._icon.style.WebkitTransition = "all .15s linear";
			this._icon.style.MozTransition = "all .15s linear";
			this._icon.style.MsTransition = "all .15s linear";
			this._icon.style.OTransition = "all .15s linear";
			this._icon.style.WebkitTransform = this._icon.style.WebkitTransform + 'translate(0px, 12px)  rotate(' + this.options.iconAngle + 'deg)';
			this._icon.style.MozTransform = 'translate(0px, 12px) rotate(' + this.options.iconAngle + 'deg)';
			this._icon.style.MsTransform = 'translate(0px, 12px) rotate(' + this.options.iconAngle + 'deg)';
			this._icon.style.OTransform = 'translate(0px, 12px) rotate(' + this.options.iconAngle + 'deg)';
		}

		this._icon.style.zIndex = pos.y;
	},

	setIconAngle: function(iconAngle) {

		if (this._map) {
			//this._removeIcon();
		}

		this.options.iconAngle = iconAngle;

		if (this._map) {
			//this._initIcon();
			this._reset();
		}
	},
	getIconAngle: function() {
		return this.options.iconAngle || 0;
	}

});