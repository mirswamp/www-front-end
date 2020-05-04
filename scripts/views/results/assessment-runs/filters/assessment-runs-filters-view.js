/******************************************************************************\
|                                                                              |
|                          assessment-runs-filters-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing assessment filters.                 |
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
	'text!templates/results/assessment-runs/filters/assessment-runs-filters.tpl',
	'models/projects/project',
	'collections/projects/projects',
	'views/base-view',
	'views/projects/filters/project-filter-view',
	'views/packages/filters/package-filter-view',
	'views/tools/filters/tool-filter-view',
	'views/platforms/filters/platform-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Validate, Collapse, Template, Project, Projects, BaseView, ProjectFilterView, PackageFilterView, ToolFilterView, PlatformFilterView, DateFilterView, LimitFilterView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			project: '#project-filter',
			package: '#package-filter',
			tool: '#tool-filter',
			platform: '#platform-filter',
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
			if (application.session.user.hasProjects()) {
				tags += this.getChildView('project').getTag();
			}
			tags += this.getChildView('package').getTag();
			tags += this.getChildView('tool').getTag();
			tags += this.getChildView('platform').getTag();
			tags += this.getChildView('date').getTags();
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
			if (!attributes || _.contains(attributes, 'package')) {
				_.extend(data, this.getChildView('package').getData());
			}
			if (!attributes || _.contains(attributes, 'tool')) {
				_.extend(data, this.getChildView('tool').getData());
			}
			if (!attributes || _.contains(attributes, 'platform')) {
				_.extend(data, this.getChildView('platform').getData());
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
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(attrs, this.getChildView('project').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'package')) {
				_.extend(attrs, this.getChildView('package').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'tool')) {
				_.extend(attrs, this.getChildView('tool').getAttrs());
			}
			if (!attributes || _.contains(attributes, 'platform')) {
				_.extend(attrs, this.getChildView('platform').getAttrs());
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
			queryString = addQueryString(queryString, this.getChildView('project').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('package').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('tool').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('platform').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('date').getQueryString());
			queryString = addQueryString(queryString, this.getChildView('limit').getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset filter dependencies
			//
			this.getChildView('package').setProject(undefined, {
				silent: true
			});
			this.getChildView('tool').setPackage(undefined, {
				silent: true
			});
			this.getChildView('platform').setTool(undefined, {
				silent: true
			});

			// reset sub filters
			//
			this.getChildView('project').reset({
				silent: true
			});
			this.getChildView('package').reset({
				silent: true,
				update: true
			});
			this.getChildView('tool').reset({
				silent: true,
				update: true
			});
			this.getChildView('platform').reset({
				silent: true,
				update: true
			});
			this.getChildView('date').reset({
				silent: true
			});
			this.getChildView('limit').reset({
				silent: true
			});
			
			// update filter data
			//
			var projects = this.options.data.projects;
			this.options.data = this.getData();
			this.options.data.projects = projects;
			
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
					'project-filter': this.options.data.project != undefined,
					'package-filter': this.options.data.package != undefined || this.options.data['package-version'] != undefined,
					'tool-filter': this.options.data.tool != undefined || this.options.data['tool-version'] != undefined,
					'platform-filter': this.options.data.platform != undefined || this.options.data['platform-version'] != undefined,
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
			this.showChildView('project', new ProjectFilterView({
				collection: hasProjects? this.options.data.project : undefined,
				defaultValue: undefined,
				initialValue: !hasProjects? this.options.data.project : undefined,
				
				// callbacks
				//
				onChange: function(changes) {
					self.getChildView('package').setProject(changes.project);
					self.onChange();
				}
			}));
			this.showChildView('package', new PackageFilterView({
				model: this.getChildView('project').getSelected(),
				projects: this.options.data.projects,
				initialSelectedPackage: this.options.data.package,
				initialSelectedPackageVersion: this.options.data['package-version'],
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],

				// callbacks
				//
				onChange: function(changes) {
					self.getChildView('tool').setPackage(changes.package);
					self.onChange();
				}
			}));
			this.showChildView('tool', new ToolFilterView({
				model: this.getChildView('project').getSelected(),
				initialSelectedTool: this.options.data.tool,
				initialSelectedToolVersion: this.options.data['tool-version'],
				packageSelected: this.options.data.package,
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],
				
				// callbacks
				//
				onChange: function(changes) {
					self.getChildView('platform').setTool(changes.tool);
					self.onChange();
				}
			}));
			this.showChildView('platform', new PlatformFilterView({
				model: this.getChildView('project').getSelected(),
				initialSelectedPlatform: this.options.data.platform,
				initialSelectedPlatformVersion: this.options.data['platform-version'],
				toolSelected: this.options.data.tool,
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],	

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