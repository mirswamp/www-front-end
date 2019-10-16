/******************************************************************************\
|                                                                              |
|                                  browser.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for detecting differences between             |
|        different browsers.                                                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([], {

	//
	// browser detection
	//

	isChrome: navigator.userAgent.indexOf('Chrome') > -1,
	isExplorer: navigator.userAgent.indexOf('MSIE') > -1,
	isFirefox: navigator.userAgent.indexOf('Firefox') > -1,
	isSafari: navigator.userAgent.indexOf("Safari") > -1 &&
		navigator.userAgent.indexOf('Chrome') == -1,

	name: function() {
		if (navigator.userAgent.indexOf('Chrome') > -1) {
			return 'Chrome';
		} else if (navigator.userAgent.indexOf('MSIE') > -1) {
			return 'Explorer';
		} else if (navigator.userAgent.indexOf('Firefox') > -1) {
			return 'Firefox';
		} else if (navigator.userAgent.indexOf("Safari") > -1) {
			return 'Safari';
		}
	}(),

	//
	// device detection
	//

	device: function() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		// Windows Phone must come first because its UA also contains "Android"
		//
		if (/windows phone/i.test(userAgent)) {
			return 'phone';
		} else if (/android/i.test(userAgent)) {
			return 'phone';
		} else if (/iPad/.test(userAgent) && !window.MSStream) {
			return 'tablet';
		} else if (/iPhone/.test(userAgent) && !window.MSStream) {
			return 'phone';
		} else if (/iPod/.test(userAgent) && !window.MSStream) {
			return 'phone';
		} else {
			return 'desktop';
		}
	}(),

	isTouchEnabled: function() {
		return (this.device != 'desktop') || window.PointerEvent && navigator.maxTouchPoints > 1;
	},

	//
	// OS detection
	//

	isMobile: function() {
		return this.device == 'phone' || this.device == 'tablet';
	},
	
	mobileOS: function() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		// Windows Phone must come first because its UA also contains "Android"
		//
		if (/windows phone/i.test(userAgent)) {
			return 'Windows Phone';
		} else if (/android/i.test(userAgent)) {
			return 'Android';
		} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
			return 'iOS';
		}
	}(),

	//
	// feature detection
	//

	supportsCors: function() {
		if ("withCredentials" in new XMLHttpRequest()) {
			return true;	
		} else if (window.XDomainRequest) {
			return true;
		} else {
			return false;
		}
	}(),

	supportsHTTPRequestUploads: function() {
		return window.XMLHttpRequest && ('upload' in new XMLHttpRequest());
	}(),

	supportsFormData: function() {
		return (window.FormData !== null);
	}(),

	//
	// browser security querying methods
	//

	sameDomain: function(url) {
		var a = document.createElement('a');
		a.href = url;

		return location.hostname === a.hostname && location.protocol === a.protocol;
	},

	xFramesAllowed: function(headers) {
		for (var i = 0; i < headers.length; i++) {

			// split on first colon
			//
			var header = headers[i].split(/:(.+)/);

			// check key value pair
			//
			if (header.length > 1) {
				var key = header[0].toLowerCase();
				var value = header[1].trim();
				
				switch (key) {

					case 'x-frame-options':
						value = value.toLowerCase();
						if (value == 'sameorigin' || value == 'deny') {
							return false;
						}
						break;

					case 'access-control-allow-origin':
						if (value != '*' && value != '') {
							return false;
						}
						break;

					case 'x-xss-protection':
					case 'content-security-policy':
						return false;
				}
			}
		}
		return true;
	},

	//
	// file downloading methods
	//

	download: function(urls) {

		// check arguments
		//
		if (!urls) {
			throw new Error('Browser::download: `urls` parameter is required.');
		}

		// check if download 'a' links are not supported
		//
		if (typeof document.createElement('a').download === 'undefined') {

			// use iframes
			//
			var i = 0;
			return (function createIframe() {
				var frame = document.createElement('iframe');
				frame.style.display = 'none';
				frame.src = urls[i++];
				document.documentElement.appendChild(frame);

				// the download init has to be sequential otherwise IE only use the first
				//
				var interval = setInterval(function () {
					if (frame.contentWindow.document.readyState === 'complete' || 
						frame.contentWindow.document.readyState === 'interactive') {
						clearInterval(interval);

						// Safari needs a timeout
						//
						setTimeout(function () {
							frame.parentNode.removeChild(frame);
						}, 1000);

						if (i < urls.length) {
							createIframe();
						}
					}
				}, 100);
			})(urls);
		}

		if (!Array.isArray(urls)) {
			var url = urls;
			
			// download single file
			//
			var a = document.createElement('a');
			a.download = '';
			a.href = url;

			// firefox doesn't support `a.click()`...
			//
			a.dispatchEvent(new MouseEvent('click'));
		} else {

			// download multiple files
			//
			var delay = 0;

			urls.forEach(function (url) {

				// the download init has to be sequential for Firefox 
				// if the urls are not on the same domain
				//
				if (isFirefox() && !this.sameDomain(url)) {
					return setTimeout(download.bind(null, url), 100 * ++delay);
				}

				this.download(url);
			});
		}
	}
});