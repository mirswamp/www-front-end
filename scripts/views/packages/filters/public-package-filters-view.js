/******************************************************************************\
|                                                                              |
|                            public-package-filters-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing public packages filters.            |
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
	'text!templates/packages/filters/public-package-filters.tpl',
	'registry',
	'utilities/query-strings',
	'utilities/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'views/packages/filters/package-type-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, QueryStrings, UrlStrings, Project, Projects, PackageTypeFilterView, LimitFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageTypeFilter: '#package-type-filter',
			limitFilter: '#limit-filter'
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
			tags += this.packageTypeFilter.currentView.getTag();
			tags += this.limitFilter.currentView.getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'package-type')) {
				_.extend(data, this.packageTypeFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(data, this.limitFilter.currentView.getData());
			}

			return data;
		},

		getAttrs: function(attributes) {
			var attrs = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'package-type')) {
				_.extend(attrs, this.packageTypeFilter.currentView.getAttrs());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(attrs, this.limitFilter.currentView.getAttrs());
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';

			// add info for filters
			//
			queryString = addQueryString(queryString, this.packageTypeFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.limitFilter.currentView.getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.packageTypeFilter.currentView.reset({
				silent: true
			});
			this.limitFilter.currentView.reset({
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
					'type-filter': this.options.data['type'] != undefined,
					'limit-filter': this.options.data['limit'] != undefined
				}
			}));
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.packageTypeFilter.show(new PackageTypeFilterView({
				model: this.model,
				initialValue: this.options.data['type'],

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}			
			}));
			this.limitFilter.show(new LimitFilterView({
				model: this.model,
				defaultValue: undefined,
				initialValue: this.options.data['limit'],

				// callbacks
				//
				onChange: function() {
					self.onChange();
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