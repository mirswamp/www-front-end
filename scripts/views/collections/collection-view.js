/******************************************************************************\
|                                                                              |
|                              collection-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base class for creating collection views.              |
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
	'underscore',
	'backbone',
	'marionette'
], function($, _, Backbone, Marionette) {
	'use strict';
	
	return Marionette.CollectionView.extend({

		//
		// querying methods
		//

		hasParentView: function(className) {
			if (this.$el.hasClass(className)) {
				return true;
			} else if (this.parent && this.parent.getParentView) {
				return this.parent.hasParentView(className);
			}
		},

		getParentView: function(className) {
			if (this.$el.hasClass(className)) {
				return this;
			} else if (this.parent && this.parent.getParentView) {
				return this.parent.getParentView(className);
			}
		},

		getChildViewAt: function(index) {
			return this.children.findByIndex(index);
		},

		getItemView: function(model) {
			return this.children.findByModel(model);
		},

		//
		// form validation methods
		//

		isValid: function() {
			for (var i = 0; i < this.children.length; i++) {
				if (!this.getChildViewAt(i).isValid()) {
					return false;
				}
			}
			return true;
		},
		
		//
		// filtering methods
		//

		viewFilter: function (child, index, collection) {
			if (child.parent && child.parent.options.filter) {
				return child.parent.options.filter(child, index, collection);
			} else {
				return true;
			}
		},

		//
		// rendering methods
		//

		addChildView: function(view, index) {

			// attach child to parent
			//
			view.parent = this;

			// call superclass method
			//
			Marionette.CollectionView.prototype.addChildView.call(this, view, index);
		},

		addTooltips: function(options) {
			if (options && options.container) {
				this.options.tooltips = options;
			}

			// show tooltips on hover
			//
			this.$el.find('[data-toggle="tooltip"]').tooltip(_.extend({
				trigger: 'hover'
			}, options));
		}
	});
});
