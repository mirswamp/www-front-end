/******************************************************************************\
|                                                                              |
|                              event-filters-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing events filters.                     |
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
	'marionette',
	'jquery.validate',
	'bootstrap/collapse',
	'modernizr',
	'text!templates/events/filters/event-filters.tpl',
	'registry',
	'utilities/browser/query-strings',
	'utilities/browser/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'views/events/filters/event-type-filter-view',
	'views/projects/filters/project-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, QueryStrings, UrlStrings, Project, Projects, EventTypeFilterView, ProjectFilterView, DateFilterView, LimitFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			eventTypeFilter: '#event-type-filter',
			projectFilter: '#project-filter',
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
			tags += this.eventTypeFilter.currentView.getTag();
			tags += this.projectFilter.currentView.getTag();
			tags += this.dateFilter.currentView.getTags();
			tags += this.limitFilter.currentView.getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'type')) {
				_.extend(data, this.eventTypeFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(data, this.projectFilter.currentView.getData());
			}
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
			if (!attributes || _.contains(attributes, 'type')) {
				_.extend(attrs, this.eventTypeFilter.currentView.getAttrs());
			}
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(attrs, this.projectFilter.currentView.getAttrs());
			}
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
			queryString = addQueryString(queryString, this.eventTypeFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.projectFilter.currentView.getQueryString());	
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
			this.eventTypeFilter.currentView.reset({
				silent: true
			});
			this.projectFilter.currentView.reset({
				silent: true
			});
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
					'type-filter': this.options.data['type'] != undefined,
					'project-filter': this.options.data['project'] != undefined,
					'date-filter': this.options.data['after'] != undefined || this.options.data['before'] != undefined,
					'limit-filter': this.options.data['limit'] !== null
				}
			}));
		},

		onRender: function() {
			var self = this;
			var hasProject = this.options.data['project'] && this.options.data['project'].constructor == Project;
			var hasProjects = this.options.data['project'] && this.options.data['project'].constructor == Projects;
			
			// show subviews
			//
			this.eventTypeFilter.show(new EventTypeFilterView({
				model: this.model,
				initialValue: this.options.data['type']? 
					new Backbone.Model({
						value: this.options.data['type']
					}) : 0,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}			
			}));
			this.projectFilter.show(new ProjectFilterView({
				collection: hasProjects? this.options.data['project'] : undefined,
				defaultValue: undefined,
				initialValue: !hasProjects? this.options.data['project'] : undefined,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}
			}));
			this.dateFilter.show(new DateFilterView({
				initialAfterDate: this.options.data['after'],
				initialBeforeDate: this.options.data['before'],

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}				
			}));
			this.limitFilter.show(new LimitFilterView({
				defaultValue: 50,
				initialValue: this.options.data['limit'],

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