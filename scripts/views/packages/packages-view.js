/******************************************************************************\
|                                                                              |
|                                  packages-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a list of user packages.                   |
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
	'text!templates/packages/packages.tpl',
	'utilities/web/query-strings',
	'utilities/web/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'collections/packages/packages',
	'views/base-view',
	'views/packages/filters/package-filters-view',
	'views/packages/list/packages-list-view'
], function($, _, Template, QueryStrings, UrlStrings, Project, Projects, Packages, BaseView, PackageFiltersView, PackagesListView) {
	return BaseView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			filters: '#package-filters',
			list: '#packages-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #add-new-package': 'onClickAddNewPackage',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// consstructor
		//

		initialize: function() {
			this.collection = new Packages();
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			if (this.getChildView('filters')) {
				return this.getChildView('filters').getData();
			}
		},

		getFilterAttrs: function() {
			if (this.getChildView('filters')) {
				return this.getChildView('filters').getAttrs();
			}
		},

		//
		// ajax methods
		//

		fetchProjectPackages: function(project, done) {
			var filterData = this.getFilterData();
			delete filterData['project'];

			// fetch packages for a single project
			//
			this.collection.fetchProtected(project, {

				// attributes
				//
				data: filterData,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get packages for this project."
					});
				}
			});
		},

		fetchProjectsPackages: function(projects, done) {
			var filterData = this.getFilterData();
			delete filterData['project'];

			// fetch packages for multiple projects
			//
			this.collection.fetchAllProtected(projects, {

				// attributes
				//
				data: filterData,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get packages for all projects."
					});
				}
			});
		},

		fetchPackages: function(done) {
			if (this.options.data['project']) {

				// fetch packages for a single project
				//
				this.fetchProjectPackages(this.options.data['project'], done);
			} else if (this.options.data['projects'] && this.options.data['projects'].length > 0) {

				// fetch packages for multiple projects
				//
				this.fetchProjectsPackages(this.options.data['projects'], done);
			} else {

				// fetch packages for trial project
				//
				if (this.model) {
					this.fetchProjectPackages(this.model, done);
				} else {
					done();
				}
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				project: this.options.data['project'],
				packageType: this.options.data['type'],
				loggedIn: application.session.user != null,
				showNumbering: application.options.showNumbering
			};
		},

		onRender: function() {

			// show package filters
			//
			this.showFilters();

			// show packages
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;
			
			// show package filters view
			//
			this.showChildView('filters', new PackageFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
				
					// update filter data
					//
					var projects = self.options.data.projects;
					self.options.data = self.getFilterData();
					self.options.data.projects = projects;

					// update url
					//
					var queryString = self.getQueryString();
					var state = window.history.state;
					var url = getWindowBaseLocation() + (queryString? ('?' + queryString) : '');
					window.history.pushState(state, '', url);

					// update view
					//
					self.onChange();
				}
			}));
		},

		showList: function() {
			this.showChildView('list', new PackagesListView({
				collection: this.collection,
				showProjects: application.session.user.get('has_projects'),
				showNumbering: application.options.showNumbering,
				showDelete: true,
			}));
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchPackages(function() {
				self.showList();
			});
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update list
			//
			this.fetchAndShowList();
		},

		onClickResetFilters: function() {
			this.getChildView('filters').reset();
		},

		onClickAddNewPackage: function() {

			// go to add new package view
			//
			Backbone.history.navigate('#packages/add', {
				trigger: true
			});
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
