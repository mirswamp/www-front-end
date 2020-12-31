/******************************************************************************\
|                                                                              |
|                                   resizing.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a mixin for defining dialog behaviors.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore'
], function($, _) {
	'use strict';
	
	return {

		//
		// resizing methods
		//

		getDefaultSize: function() {
			return this.size;
		},

		//
		// methods
		//

		enableResize: function() {
			var self = this;
			require([
				'jquery-ui/resizable'
			], function () {

				// make modal resizable
				//
				self.$el.find('.modal-dialog').resizable({
					handles: "all",

					// callbacks
					//
					start: function(event) {
						self.onResizeStart(event);
					},
					resize: function(event) {
						self.onResize(event);
					},
					stop: function(event) {
						self.onResizeStop(event);
					}
				});
			});
		},

		saveSize: function() {

			// save size, including borders
			//
			var width = this.$el.find('.modal-dialog')[0].offsetWidth;
			var height = this.$el.find('.modal-dialog')[0].offsetHeight;
			this.options.size = [width, height];
		},

		setSize: function(size) {
			this.$el.find('.modal-dialog').css({
				'width': size? size[0] : '',
				'height': size? size[1] : ''
			});

			// respond to resize
			//
			this.onResize();
		},

		resetSize: function() {
			this.setSize(this.getDefaultSize());
		},

		restoreSize: function() {
			this.setSize(this.options.size);
		},

		//
		// window event handling methods
		//

		onResizeStart: function() {
			this.fixPosition();
			this.$el.find('.modal-dialog').addClass('resized');

			// perform callback
			//
			if (this.options.onResizeStart) {
				this.options.onResizeStart();
			}
		},

		onResize: function() {

			// perform callback
			//
			if (this.options.onResize) {
				this.options.onResize();
			}
		},

		onResizeStop: function() {

			// perform callback
			//
			if (this.options.onResizeStop) {
				this.options.onResizeStop();
			}
		}
	};
});
