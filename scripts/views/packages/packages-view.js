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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/packages.tpl',
	'registry',
	'utilities/browser/query-strings',
	'utilities/browser/url-strings',
	'models/projects/project',
	'collections/projects/projects',
	'collections/packages/packages',
	'views/dialogs/error-view',
	'views/packages/filters/package-filters-view',
	'views/packages/list/packages-list-view'
], function($, _, Backbone, Marionette, Template, Registry, QueryStrings, UrlStrings, Project, Projects, Packages, ErrorView, PackageFiltersView, PackagesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			packageFilters: '#package-filters',
			packagesList: '#packages-list'
		},

		events: {
			'click #reset-filters': 'onClickResetFilters',
			'click #add-new-package': 'onClickAddNewPackage',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Packages();
		},

		//
		// query string / filter methods
		//

		getQueryString: function() {
			return this.packageFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			if (this.packageFilters.currentView) {
				return this.packageFilters.currentView.getData();
			}
		},

		getFilterAttrs: function() {
			if (this.packageFilters.currentView) {
				return this.packageFilters.currentView.getAttrs();
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get packages for this project."
						})
					);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get packages for all projects."
						})
					);
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				project: this.options.data['project'],
				packageType: this.options.data['type'],
				loggedIn: Registry.application.session.user != null,
				showNumbering: Registry.application.options.showNumbering
			}));
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
			this.packageFilters.show(
				new PackageFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						//setQueryString(self.packageFilters.currentView.getQueryString());			
					
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
				})
			);
		},

		showList: function() {
			this.packagesList.show(
				new PackagesListView({
					collection: this.collection,
					showNumbering: Registry.application.options.showNumbering,
					showDelete: true,
				})
			);
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
			this.packageFilters.currentView.reset();
		},

		onClickAddNewPackage: function() {

			// go to add new package view
			//
			Backbone.history.navigate('#packages/add', {
				trigger: true
			});
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
