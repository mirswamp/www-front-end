/******************************************************************************\
|                                                                              |
|                               modal-region.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a way to display modal dialog boxes.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/dialogs/modal.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.Region.extend({

		//
		// attributes
		//

		el: '#modal',

		//
		// methods
		//

		show: function(view, options) {

			// call superclass method
			//
			Backbone.Marionette.Region.prototype.show.call(this, view);

			// clear tooltips
			//
			$('.viewport').find('.tooltip').remove();

			// create modal element
			//
			this.$el = $(Template);

			// set modal styles
			//
			this.$el.addClass('fade');

			// set dialog size
			//
			if (options && options.size) {
				switch (options.size) {
					case 'small':
						this.$el.find('.modal-dialog').addClass('modal-sm');
						break;
					case 'large':
						this.$el.find('.modal-dialog').addClass('modal-lg');
						break;
				}
			}

			// remove any previous modals
			//
			$('.modal').remove();

			// remove backdrops from any previous dialogs
			//
			$('.modal-backdrop').remove();

			// add view elements to modal
			//
			this.$el.find('.modal-content').append(view.$el);

			// append modal to document
			//
			$('body').append(this.$el);

			// trigger plug-in
			//
			this.$el.modal('show');

			// set up callbacks
			//
			var self = this;
			this.$el.on('shown.bs.modal', function() {
				if (self.onShown) {
					self.onShown(options);
				}
			});
			this.$el.on('hidden.bs.modal', function() {
				if (self.onHidden) {
					self.onHidden(options);
				}
			});
		},

		onShow: function() {
			this.enableDrag();
		},
		
		enableDrag: function() {
			var self = this;
			require([
				//'jquery-ui'
				'draggable'
			], function () {

				// make modal draggable
				//
				self.$el.draggable({
					handle: '.modal-header'
				});
			});
		},

		hide: function() {

			// trigger plug-in
			//
			this.$el.modal('hide');

			// perform callback
			//
			if (this.onHide) {
				this.onHide();
			}
		},

		//
		// event handling methods
		//

		onShown: function(options) {

			// set focus on first primary button
			//
			this.$el.find('.btn-primary ').first().focus();

			// set focus on first input elements
			//
			if (!options || options.focus) {
				var focus = 'input';

				// find type of element to focus on
				//
				if (options && options.focus != true) {
					focus = options.focus;
				}

				// find first element to focus on
				//
				var element = this.$el.find(focus).first();
				if (element && (element.attr('no-focus') || element.attr('no-focus') === '')) {
					return;
				} else if (element) {
					element.focus();
				}
			}
		},

		onHidden: function() {
			this.$el.remove();
		}
	});
});
