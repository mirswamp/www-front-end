/******************************************************************************\
|                                                                              |
|                                       sound.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a definition of a basic HTML5 sound class.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'underscore'
], function(_) {

	//
	// constructor
	//

	function Sound(attributes) {

		// set optional parameter defaults
		//
		if (!attributes.context) {
			if (!Sound.context) {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				Sound.context = new AudioContext();
			}
			attributes.context = Sound.context;
		}

		// set attributes
		//
		this.url = attributes.url;
		this.context = attributes.context;
		this.volume = attributes.context.createGain();
		this.buffer = null;

		return this;
	}

	_.extend(Sound.prototype, {

		//
		// methods
		//

		load: function(url, done) {
			if (!this.loaded) {
				var self = this;
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';

				// decode asynchronously
				//
				request.onload = function() {
					self.context.decodeAudioData(request.response, function(data) {

						// set source buffer data
						//
						self.buffer = data;

						// notify of loading
						//
						self.loaded = true;
						self.onLoad();

						// perform callback
						//
						if (done) {
							done();
						}
					}, function(error) {
						alert("Error - could not decode audio: " + error)
					});
				}

				request.send();
			}
		},

		play: function() {

			// load sound on demand
			//
			if (!this.loaded) {
				var self = this;
				this.load(this.url, function() {
					self.start();
				});
			} else {
				this.start();
			}
		},

		start: function() {

			// create new audio buffer 
			//
			this.source = this.context.createBufferSource();
			this.source.buffer = this.buffer;

			// connect the source to the context's destination (the speakers)
			//
			this.source.connect(this.context.destination);

			// connect the sound source to the volume control
			//
			this.source.connect(this.volume);

			// play the source
			//
			this.source.start(0);		
		},

		stop: function() {
			this.source.stop();
		},

		destroy: function() {
			// this.context.close();
		},
		
		//
		// event handling methods
		//

		onLoad: function() {
			if (this.onload) {
				this.onload();
			}
		}
	});

	// return constructor
	//
	return Sound;
});