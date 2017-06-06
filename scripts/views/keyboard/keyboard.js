/******************************************************************************\
|                                                                              |
|                                   keyboard.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for keeping track of the keyboard state and         |
|        for triggering keyboard events on DOM elements that wouldn't          |
|        otherwise respond to keyboard events.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette'
], function($, _, Backbone, Marionette) {
	'use strict';
	
	return Marionette.View.extend({

		//
		// attributes
		//
		
		keyDown: [],

		//
		// constructor
		//

		initialize: function(options) {
			var self = this;

			// create key handlers
			//
			$(window).on('keydown', function(event) {

				// update key mask
				//
				self.keyDown[event.keyCode] = true;

				// trigger DOM event
				//
				self.trigger('keydown', event);
			});
			$(window).on('keypress', function(event) {

				// trigger DOM event
				//
				self.trigger('keypress', event);
			});
			$(window).on('keyup', function(event) {

				// update key mask
				//
				self.keyDown[event.keyCode] = false;

				// trigger DOM event
				//
				self.trigger('keyup', event);
			});
		},

		//
		// querying methods
		//

		isKeyDown: function(keycode) {
			return this.keyDown[keycode];
		},

		//
		// methods
		//

		reset: function() {

			// reset key mask
			//
			for (var key in this.keyDown) {
				this.keyDown[key] = false;
			}
		},
	});
});