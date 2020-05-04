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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'jquery.validate',
	'bootstrap/collapse',
	'text!templates/schedules/filters/schedule-filters.tpl',
	'utilities/web/query-strings',
	'utilities/web/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'views/base-view',
	'views/projects/filters/project-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Validate, Collapse, Template, QueryStrings, UrlStrings, Project, Projects, BaseView, ProjectFilterView, LimitFilterView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			project: '#project-filter',
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
			if (application.session.user.hasProjects()) {
				tags += this.getChildView('project').getTag();
			}
			tags += this.getChildView('limit').getTag();

			return tags;
		},

		getData: function(attributes) {
			var data = {};

			// add info for filters
			//
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(data, this.getChildView('project').getData());
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
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(attrs, this.getChildView('project').getAttrs());
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
			queryString = addQueryString(queryString, this.getChildView('project').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('limit').getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset sub filters
			//
			this.getChildView('project').reset({
				silent: true
			});
			this.getChildView('limit').reset({
				silent: true
			});

			// update 
			//
			this.onChange();
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				highlighted: {
					'project-filter': this.options.data.project != undefined,
					'limit-filter': this.options.data.limit != undefined
				}
			};
		},

		onRender: function() {
			var self = this;
			var hasProject = this.options.data.project && this.options.data.project.constructor == Project;
			var hasProjects = this.options.data.project && this.options.data.project.constructor == Projects;

			// show subviews
			//
			this.showChildView('project', new ProjectFilterView({
				collection: hasProjects? this.options.data.project : undefined,
				defaultValue: undefined,
				initialValue: !hasProjects? this.options.data.project : undefined,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));
			this.showChildView('limit', new LimitFilterView({
				defaultValue: undefined,
				initialValue: this.options.data.limit,

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