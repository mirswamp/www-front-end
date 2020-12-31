/******************************************************************************\
|                                                                              |
|                                   base-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base class for creating views.               |
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
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/tooltip'
], function($, _, Backbone, Marionette, Tooltip) {
	'use strict';
	
	return Marionette.View.extend(_.extend({}, {

		//
		// tooltip attributes
		//
		
		tooltip_container: undefined,
		tooltip_trigger: 'hover',
		tooltip_placement: undefined,

		//
		// querying methods
		//

		hasChildView: function(name) {
			return this.getChildView(name) != undefined;
		},

		getChildView: function(name) {
			if (this.getRegion(name)) {
				return this.getRegion(name).currentView;
			}
		},

		hasParentView: function(className) {
			if (this.$el.hasClass(className)) {
				return true;
			} else if (this.parent && this.parent.hasParentView) {
				return this.parent.hasParentView(className);
			} else {
				return false;
			}
		},

		getParentView: function(className) {
			if (this.$el.hasClass(className)) {
				return this;
			} else if (this.parent && this.parent.getParentView) {
				return this.parent.getParentView(className);
			}
		},

		//
		// rendering methods
		//

		showChildView: function(name, view, options) {
			
			// attach child to parent
			//
			view.parent = this;

			// call superclass method
			//
			Marionette.View.prototype.showChildView.call(this, name, view, options);
		},

		reflow: function() {
			var height = this.el.offsetHeight;
		},

		setVisibility: function(selector, visibility) {
			if (visibility) {
				this.$el.find(selector).show();
			} else {
				this.$el.find(selector).hide();
			}
		},

		//
		// tooltip meyhods
		//

		addTooltips: function(options) {

			// show tooltips on trigger
			//
			this.$el.find('[data-toggle="tooltip"]').addClass('tooltip-trigger').tooltip(_.extend({
				container: this.tooltip_container,
				trigger: this.tooltip_trigger,
				placement: this.tooltip_placement
			}, options));
		},

		removeTooltips: function(options) {
			if (options && options.container) {
				$(options.container).find('.tooltip').remove();
			} else {
				this.$el.find('.tooltip').remove();
			}
		},
		
		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			this.removeTooltips();
		}
	}));
});
