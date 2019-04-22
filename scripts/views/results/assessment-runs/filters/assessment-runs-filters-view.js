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
	'text!templates/results/assessment-runs/filters/assessment-runs-filters.tpl',
	'registry',
	'models/projects/project',
	'collections/projects/projects',
	'views/dialogs/confirm-view',
	'views/projects/filters/project-filter-view',
	'views/packages/filters/package-filter-view',
	'views/tools/filters/tool-filter-view',
	'views/platforms/filters/platform-filter-view',
	'views/widgets/filters/date-filter-view',
	'views/widgets/filters/limit-filter-view'
], function($, _, Backbone, Marionette, Validate, Collapse, Modernizr, Template, Registry, Project, Projects, ConfirmView, ProjectFilterView, PackageFilterView, ToolFilterView, PlatformFilterView, DateFilterView, LimitFilterView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectFilter: '#project-filter',
			packageFilter: '#package-filter',
			toolFilter: '#tool-filter',
			platformFilter: '#platform-filter',
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
			if (Registry.application.session.user.get('has_projects')) {
				tags += this.projectFilter.currentView.getTag();
			}
			tags += this.packageFilter.currentView.getTag();
			tags += this.toolFilter.currentView.getTag();
			tags += this.platformFilter.currentView.getTag();
			tags += this.dateFilter.currentView.getTags();
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
			if (!attributes || _.contains(attributes, 'package')) {
				_.extend(data, this.packageFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'tool')) {
				_.extend(data, this.toolFilter.currentView.getData());
			}
			if (!attributes || _.contains(attributes, 'platform')) {
				_.extend(data, this.platformFilter.currentView.getData());
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
			if (!attributes || _.contains(attributes, 'project')) {
				_.extend(attrs, this.projectFilter.currentView.getAttrs());
			}
			if (!attributes || _.contains(attributes, 'package')) {
				_.extend(attrs, this.packageFilter.currentView.getAttrs());
			}
			if (!attributes || _.contains(attributes, 'tool')) {
				_.extend(attrs, this.toolFilter.currentView.getAttrs());
			}
			if (!attributes || _.contains(attributes, 'platform')) {
				_.extend(attrs, this.platformFilter.currentView.getAttrs());
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
			queryString = addQueryString(queryString, this.projectFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.packageFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.toolFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.platformFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.dateFilter.currentView.getQueryString());
			queryString = addQueryString(queryString, this.limitFilter.currentView.getQueryString());

			return queryString;
		},

		//
		// filter reset methods
		//

		reset: function(options) {

			// reset filter dependencies
			//
			this.packageFilter.currentView.setProject(undefined, {
				silent: true
			})
			this.toolFilter.currentView.setPackage(undefined, {
				silent: true
			})
			this.platformFilter.currentView.setTool(undefined, {
				silent: true
			});

			// reset sub filters
			//
			this.projectFilter.currentView.reset({
				silent: true
			});
			this.packageFilter.currentView.reset({
				silent: true,
				update: true
			});
			this.toolFilter.currentView.reset({
				silent: true,
				update: true
			});
			this.platformFilter.currentView.reset({
				silent: true,
				update: true
			});
			this.dateFilter.currentView.reset({
				silent: true
			});
			this.limitFilter.currentView.reset({
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				highlighted: {
					'project-filter': this.options.data['project'] != undefined,
					'package-filter': this.options.data['package'] != undefined || this.options.data['package-version'] != undefined,
					'tool-filter': this.options.data['tool'] != undefined || this.options.data['tool-version'] != undefined,
					'platform-filter': this.options.data['platform'] != undefined || this.options.data['platform-version'] != undefined,
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
			this.projectFilter.show(new ProjectFilterView({
				collection: hasProjects? this.options.data['project'] : undefined,
				//defaultValue: !hasProjects? this.model : undefined,
				defaultValue: undefined,
				initialValue: !hasProjects? this.options.data['project'] : undefined,
				
				// callbacks
				//
				onChange: function(changes) {
					self.packageFilter.currentView.setProject(changes.project);
					self.onChange();
				}
			}));
			this.packageFilter.show(new PackageFilterView({
				model: this.projectFilter.currentView.getSelected(),
				projects: this.options.data['projects'],
				initialSelectedPackage: this.options.data['package'],
				initialSelectedPackageVersion: this.options.data['package-version'],
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],

				// callbacks
				//
				onChange: function(changes) {
					self.toolFilter.currentView.setPackage(changes.package);
					self.onChange();
				}
			}));
			this.toolFilter.show(new ToolFilterView({
				model: this.projectFilter.currentView.getSelected(),
				initialSelectedTool: this.options.data['tool'],
				initialSelectedToolVersion: this.options.data['tool-version'],
				packageSelected: this.options.data['package'],
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],
				
				// callbacks
				//
				onChange: function(changes) {
					self.platformFilter.currentView.setTool(changes.tool);
					self.onChange();
				}
			}));
			this.platformFilter.show(new PlatformFilterView({
				model: this.projectFilter.currentView.getSelected(),
				initialSelectedPlatform: this.options.data['platform'],
				initialSelectedPlatformVersion: this.options.data['platform-version'],
				toolSelected: this.options.data['tool'],
				versionDefaultOptions: ["Any"],
				versionSelectedOptions: ['any'],	

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