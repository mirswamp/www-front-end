/******************************************************************************\
|                                                                              |
|                               route-filters-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing api route filters.                  |
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
	'validate',
	'collapse',
	'modernizr',
	'text!templates/api/routes/filters/route-filters.tpl',
	'registry',
	'utilities/browser/query-strings',
	'utilities/browser/url-strings',
	'views/api/routes/filters/category-filter-view',
	'views/api/routes/filters/method-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, QueryStrings, UrlStrings, CategoryFilterView, MethodFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			categoryFilter: '#category-filter',
			methodFilter: '#method-filter'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters'
		},

		//
		// querying methods
		//

		getTags: function() {
			var tags = '';

			// add tags
			//
			tags += this.categoryFilter.currentView.getTag();
			tags += this.methodFilter.currentView.getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'category')) {
				_.extend(data, this.categoryFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'method')) {
				_.extend(data, this.methodFilter.currentView.getData());
			}

			return data;
		},

		getAttrs: function(attributes) {
			var attrs = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'category')) {
				_.extend(attrs, this.categoryFilter.currentView.getAttrs());
			}
			if (!attributes || _.contains(attributes, 'method')) {
				_.extend(attrs, this.methodFilter.currentView.getAttrs());
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';

			// add info for filters
			//
			queryString = addQueryString(queryString, this.categoryFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.methodFilter.currentView.getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.categoryFilter.currentView.reset({
				silent: true
			});
			this.methodFilter.currentView.reset({
				silent: true
			});

			// update
			//
			this.onChange(options);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				highlighted: {
					'category': this.options.data['category'] != undefined,
					'method': this.options.data['method'] != undefined
				}
			}));
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.categoryFilter.show(new CategoryFilterView({
				initialValue: this.options.data['category'],

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}			
			}));
			this.methodFilter.show(new MethodFilterView({
				initialValue: this.options.data['method']? this.options.data['method'].toUpperCase() : undefined,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}			
			}));

			// show filter controls
			//
			this.showTags();
		},

		showTags: function() {
			this.$el.find('#filter-controls').html(this.getTags());
		},

		//
		// event handling methods
		//

		onClickResetFilters: function() {
			this.reset();
		},

		onChange: function(options) {

			// update filter controls
			//
			this.showTags();

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange();
			}
		}
	});
});