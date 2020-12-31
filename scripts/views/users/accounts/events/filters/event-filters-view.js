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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.validate',
	'bootstrap/collapse',
	'text!templates/users/accounts/events/filters/event-filters.tpl',
	'utilities/web/query-strings',
	'utilities/web/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'views/base-view',
	'views/users/accounts/events/filters/event-type-filter-view',
	'views/projects/filters/project-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Validate, Collapse, Template, QueryStrings, UrlStrings, Project, Projects, BaseView, EventTypeFilterView, ProjectFilterView, DateFilterView, LimitFilterView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			event_type: '#event-type-filter',
			project: '#project-filter',
			date: '#date-filter',
			limit: '#limit-filter'
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
			tags += this.getChildView('event_type').getTag();
			tags += this.getChildView('project').getTag();
			tags += this.getChildView('date').getTags();
			tags += this.getChildView('limit').getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'type')) {
				_.extend(data, this.getChildView('event_type').getData());
			}
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(data, this.getChildView('project').getData());
			}
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(data, this.getChildView('date').getData());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(data, this.getChildView('limit').getData());
			}

			return data;
		},

		getAttrs: function(attributes) {
			var attrs = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'type')) {
				_.extend(attrs, this.getChildView('event_type').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(attrs, this.getChildView('project').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'date')) {
				_.extend(attrs, this.getChildView('date').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'limit')) {
				_.extend(attrs, this.getChildView('limit').getAttrs());
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';

			// add info for filters
			//
			queryString = addQueryString(queryString, this.getChildView('event_type').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('project').getQueryString());	
			queryString = addQueryString(queryString, this.getChildView('date').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('limit').getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.getChildView('event_type').reset({
				silent: true
			});
			this.getChildView('project').reset({
				silent: true
			});
			this.getChildView('date').reset({
				silent: true
			});
			this.getChildView('limit').reset({
				silent: true
			});
			
			// update
			//
			this.onChange(options);
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				highlighted: {
					'type-filter': this.options.data.type != undefined,
					'project-filter': this.options.data.project != undefined,
					'date-filter': this.options.data.after != undefined || this.options.data.before != undefined,
					'limit-filter': this.options.data.limit !== null
				}
			};
		},

		onRender: function() {
			var self = this;
			var hasProject = this.options.data.project && this.options.data.project.constructor == Project;
			var hasProjects = this.options.data.project && this.options.data.project.constructor == Projects;
			
			// show subviews
			//
			this.showChildView('event_type', new EventTypeFilterView({
				model: this.model,
				initialValue: this.options.data.type? 
					new Backbone.Model({
						value: this.options.data.type
					}) : 0,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}			
			}));
			this.showChildView('project', new ProjectFilterView({
				collection: hasProjects? this.options.data.project : undefined,
				defaultValue: undefined,
				initialValue: !hasProjects? this.options.data.project : undefined,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}
			}));
			this.showChildView('date', new DateFilterView({
				initialAfterDate: this.options.data.after,
				initialBeforeDate: this.options.data.before,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange(changes);
				}				
			}));
			this.showChildView('limit', new LimitFilterView({
				defaultValue: 50,
				initialValue: this.options.data.limit,

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