/******************************************************************************\
|                                                                              |
|                                   dragging.js                                |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery-ui/draggable',
], function($, _, Draggable) {
	'use strict';
	
	return {

		//
		// querying methods
		//

		isDraggable: function() {
			return this.$el.find('.modal-header .handle').length > 0;
		},

		//
		// methods
		//

		enableDrag: function() {
			var self = this;

			// add drag handle
			//
			this.$el.find('.modal-header').append($('<div class="handle">'));

			// make modal draggable
			//
			this.$el.find('.modal-dialog').draggable({
				handle: '.modal-header',
				scroll: false,

				// callbacks
				//
				start: function(event) {
					self.onDragStart(event);
				},
				stop: function(event) {
					self.onDragStop(event);
				}
			});
		},

		disableDrag: function() {
			this.$el.find('.modal-dialog').draggable('disable');
		},

		reenableDrag: function() {
			this.$el.find('.modal-dialog').draggable('enable');
		},

		//
		// event handling methods
		//

		onDragStart: function() {
			this.savePosition();
		},

		onDragStop: function(event) {
			if (event.clientX < 0 || event.clientX > $(window).width() ||
				event.clientY < 0 || event.clientY > $(window).height()) {
				this.onDragOut(event);
			}

			if (!this.options.height) {
				this.$el.find('.modal-dialog').css({
					'height': ''
				});
			}
		},

		onDragOut: function(event) {
			this.restorePosition();
		}
	};
});
