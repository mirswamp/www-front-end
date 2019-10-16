/******************************************************************************\
|                                                                              |
|                                 positioning.js                               |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore'
], function($, _) {
	'use strict';
	
	return {

		//
		// querying methods
		//

		isFixed: function() {
			return this.$el.find('.modal-dialog').css('position') == 'absolute';
		},

		//
		// setting methods
		//

		savePosition: function() {
			var element = this.$el.find('.modal-dialog');

			// save positioning
			//
			this.offset = element.offset();
			this.position = element.css('position');
			this.left = element.css('left');
			this.top = element.css('top');
		},

		fixPosition: function() {
			this.savePosition();

			// remove flex centering on container
			//
			this.$el.css({
				'display': 'block'
			});

			// fix dialog position
			//
			this.$el.find('.modal-dialog').css({
				'position': 'absolute',
				'left': Math.round(this.offset.left),
				'top': Math.round(this.offset.top)
			});
		},

		restorePosition: function() {

			// restore flex centering on container
			//
			this.$el.css({
				'display': 'flex'
			});

			// free dialog position
			//
			this.$el.find('.modal-dialog').css({
				'position': this.position,
				'left': this.left,
				'top': this.top
			});
		},

		resetPosition: function() {

			// restore flex centering on container
			//
			this.$el.css({
				'display': 'flex'
			});

			// free dialog position
			//
			this.$el.find('.modal-dialog').css({
				'position': 'relative',
				'left': '',
				'top': '',
				'margin': 'auto'
			});
		}
	};
});
