/******************************************************************************\
|                                                                              |
|                              schedule-filters-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing schedule filters.                   |
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
	'text!templates/scheduled-runs/schedules/filters/schedule-filters.tpl',
	'registry',
	'utilities/browser/query-strings',
	'utilities/browser/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'views/projects/filters/project-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, QueryStrings, UrlStrings, Project, Projects, ProjectFilterView, LimitFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectFilter: '#project-filter',
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
			tags += this.projectFilter.currentView.getTag();
			tags += this.limitFilter.currentView.getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(data, this.projectFilter.currentView.getData());
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
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(attrs, this.projectFilter.currentView.getAttrs());
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
			queryString = addQueryString(queryString, this.projectFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.limitFilter.currentView.getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.projectFilter.currentView.reset({
				silent: true
			});
			this.limitFilter.currentView.reset({
				silent: true
			});

			// update 
			//
			this.onChange();
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				highlighted: {
					'project-filter': this.options.data['project'] != undefined,
					'limit-filter': this.options.data['limit'] != undefined
				}
			}));
		},

		onRender: function() {
			var self = this;
			
			// show subviews
			//
			this.projectFilter.show(new ProjectFilterView({
				model: this.model,
				collection: this.options.data['projects'],
				//defaultValue: this.model,
				defaultValue: undefined,
				initialValue: this.options.data['project'],

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