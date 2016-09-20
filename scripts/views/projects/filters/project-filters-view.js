/******************************************************************************\
|                                                                              |
|                              project-filters-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing filters for projects.               |
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
	'text!templates/projects/filters/project-filters.tpl',
	'registry',
	'utilities/query-strings',
	'utilities/url-strings',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, QueryStrings, UrlStrings, DateFilterView, LimitFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			dateFilter: '#date-filter',
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
			tags += this.dateFilter.currentView.getTags();
			tags += this.limitFilter.currentView.getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(data, this.dateFilter.currentView.getData());
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
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(attrs, this.dateFilter.currentView.getAttrs());
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
			queryString = addQueryString(queryString, this.dateFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.limitFilter.currentView.getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.dateFilter.currentView.reset({
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
					'date-filter': this.options.data['after'] != undefined || this.options.data['before'] != undefined,
					'limit-filter': this.options.data['limit'] != undefined
				}
			}));
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.dateFilter.show(new DateFilterView({
				model: this.model,
				initialAfterDate: this.options.data['after'],
				initialBeforeDate: this.options.data['before'],

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}				
			}));
			this.limitFilter.show(new LimitFilterView({
				model: this.model,
				defaultValue: 50,
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