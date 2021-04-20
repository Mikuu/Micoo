/*!
	Wheelzoom 1.1.1
	license: MIT

*/

// create CustomEvent to override window.Event in unsupported browsers
(function () {
	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
})();

// create cross browser triggerEvent function
window.triggerEvent = function(target, eventName, params) {
	if (params) {
		var e = new CustomEvent(eventName, {
			'detail': params
		});
	} else {
		try {
			var e = new Event(eventName);
		} catch (err) {
			var e = new CustomEvent(eventName);
		}
	}

	return target.dispatchEvent(e, params);
};

window.wheelzoom = (function(){
	var defaults = {
		zoom: 0.10,
		maxZoom: -1
	};

	var canvas = document.createElement('canvas');

	var main = function(img, options){
		if (!img || !img.nodeName || img.nodeName !== 'IMG') { return; }

		var settings = {};
		var width;
		var height;
		var bgWidth;
		var bgHeight;
		var bgPosX;
		var bgPosY;
		var previousEvent;
		var cachedDataUrl;
		var initBgPosX;
		var initBgPosY;

		function setSrcToBackground(img) {
			img.style.backgroundImage = 'url("'+img.src+'")';
			img.style.backgroundRepeat = 'no-repeat';
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			cachedDataUrl = canvas.toDataURL();
			img.src = cachedDataUrl;
		}

		function updateBgStyle() {
			if (bgPosX > 0) {
				bgPosX = 0;
			} else if (bgPosX < width - bgWidth) {
				bgPosX = width - bgWidth;
			}

			if (bgPosY > 0) {
				bgPosY = 0;
			} else if (bgPosY < height - bgHeight) {
				bgPosY = height - bgHeight;
			}

			img.style.backgroundSize = bgWidth+'px '+bgHeight+'px';
			img.style.backgroundPosition = bgPosX+'px '+bgPosY+'px';
		}

		function reset() {
			bgWidth = width;
			bgHeight = height;
			bgPosX = bgPosY = 0;
			updateBgStyle();
		}

		img.doZoomIn = function(propagate) {
			if (typeof propagate === 'undefined') {
				propagate = false;
			}

			doZoom(-100, propagate);
		}

		img.doZoomOut = function(propagate) {
			if (typeof propagate === 'undefined') {
				propagate = false;
			}

			doZoom(100, propagate);
		}

		function doZoom (deltaY, propagate) {
			if (typeof propagate === 'undefined') {
				propagate = false;
			}

			// zoom always at the center of the image
			var offsetX = img.width/2;
			var offsetY = img.height/2;

			// Record the offset between the bg edge and the center of the image:
			var bgCenterX = offsetX - bgPosX;
			var bgCenterY = offsetY - bgPosY;
			// Use the previous offset to get the percent offset between the bg edge and the center of the image:
			var bgRatioX = bgCenterX/bgWidth;
			var bgRatioY = bgCenterY/bgHeight;

			// Update the bg size:
			if (deltaY < 0) {
				if (settings.maxZoom == -1 || (bgWidth + bgWidth*settings.zoom) / width <= settings.maxZoom) {
					bgWidth += bgWidth*settings.zoom;
					bgHeight += bgHeight*settings.zoom;
				}
			} else {
				bgWidth -= bgWidth*settings.zoom;
				bgHeight -= bgHeight*settings.zoom;
			}

			// Take the percent offset and apply it to the new size:
			bgPosX = offsetX - (bgWidth * bgRatioX);
			bgPosY = offsetY - (bgHeight * bgRatioY);

			if (propagate) {
				if (deltaY < 0) {
					// setTimeout to handle lot of events fired
					setTimeout(function() {
						triggerEvent(img, 'wheelzoom.in', {
							zoom: bgWidth/width,
							bgPosX: bgPosX,
							bgPosY: bgPosY
						});
					}, 10);
				} else {
					// setTimeout to handle lot of events fired
					setTimeout(function() {
						triggerEvent(img, 'wheelzoom.out', {
							zoom: bgWidth/width,
							bgPosX: bgPosX,
							bgPosY: bgPosY
						});
					}, 10);
				}
			}

			// Prevent zooming out beyond the starting size
			if (bgWidth <= width || bgHeight <= height) {
				triggerEvent(img, 'wheelzoom.reset');
			} else {
				updateBgStyle();
			}
		}

		function onwheel(e) {
			var deltaY = 0;

			e.preventDefault();

			if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
				deltaY = e.deltaY;
			} else if (e.wheelDelta) {
				deltaY = -e.wheelDelta;
			}

			if (deltaY < 0) {
				img.doZoomIn(true);
			} else {
				img.doZoomOut(true);
			}
		}

		img.doDrag = function (x, y) {
			bgPosX = x;
			bgPosY = y;

			updateBgStyle();
		}

		function drag(e) {
			e.preventDefault();
			var xShift = e.pageX - previousEvent.pageX;
			var yShift = e.pageY - previousEvent.pageY;
			var x = bgPosX + xShift;
			var y = bgPosY + yShift;

			img.doDrag(x, y);

			triggerEvent(img, 'wheelzoom.drag', {
				bgPosX: bgPosX,
				bgPosY: bgPosY,
				xShift: xShift,
				yShift: yShift
			});

			previousEvent = e;
			updateBgStyle();
		}

		function removeDrag() {
			triggerEvent(img, 'wheelzoom.dragend', {
				x: bgPosX - initBgPosX,
				y: bgPosY - initBgPosY
			});

			document.removeEventListener('mouseup', removeDrag);
			document.removeEventListener('mousemove', drag);
		}

		// Make the background draggable
		function draggable(e) {
			triggerEvent(img, 'wheelzoom.dragstart');

			e.preventDefault();
			previousEvent = e;
			document.addEventListener('mousemove', drag);
			document.addEventListener('mouseup', removeDrag);
		}

		function load() {
			if (img.src === cachedDataUrl) return;

			var computedStyle = window.getComputedStyle(img, null);

			width = parseInt(computedStyle.width, 10);
			height = parseInt(computedStyle.height, 10);
			bgWidth = width;
			bgHeight = height;
			bgPosX = bgPosY = initBgPosX = initBgPosY = 0;

			setSrcToBackground(img);

			img.style.backgroundSize =  width+'px '+height+'px';
			img.style.backgroundPosition = '0 0';

			img.addEventListener('wheelzoom.reset', reset);
			img.addEventListener('wheelzoom.destroy', destroy);
			img.addEventListener('wheel', onwheel);
			img.addEventListener('mousedown', draggable);
		}

		var destroy = function (originalProperties) {
			img.removeEventListener('wheelzoom.destroy', destroy);
			img.removeEventListener('wheelzoom.reset', reset);
			img.removeEventListener('mouseup', removeDrag);
			img.removeEventListener('mousemove', drag);
			img.removeEventListener('mousedown', draggable);
			img.removeEventListener('wheel', onwheel);

			img.style.backgroundImage = originalProperties.backgroundImage;
			img.style.backgroundRepeat = originalProperties.backgroundRepeat;
			img.src = originalProperties.src;
		}.bind(null, {
			backgroundImage: img.style.backgroundImage,
			backgroundRepeat: img.style.backgroundRepeat,
			src: img.src
		});

		options = options || {};

		Object.keys(defaults).forEach(function(key){
			settings[key] = typeof options[key] !== 'undefined' ? options[key] : defaults[key];
		});

		var t = setInterval(function(){
			if (img.complete) {
				load();
			}

			clearInterval(t);
		}, 100);
	};

	// Do nothing in IE8
	if (typeof window.getComputedStyle !== 'function') {
		return function(elements) {
			return elements;
		};
	} else {
		return function(elements, options) {
			if (elements && elements.length) {
				for (var i=0;i<elements.length;i++) {
					main(elements[i], options);
				}
			} else if (elements && elements.nodeName) {
				main(elements, options);
			}

			return elements;
		};
	}
}());