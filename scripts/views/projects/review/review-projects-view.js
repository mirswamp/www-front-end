/******************************************************************************\
|                                                                              |
|                             review-projects-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for reviewing, accepting, or declining            |
|        project approval.                                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/projects/review/review-projects.tpl',
	'registry',
	'collections/projects/projects',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/projects/filters/project-filters-view',
	'views/projects/review/review-projects-list/review-projects-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Projects, NotifyView, ErrorView, ProjectFiltersView, ReviewProjectsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectFilters: '#project-filters',
			reviewProjectsList: '#review-projects-list'
		},

		events: {
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'click #show-deactivated-projects': 'onClickShowDeactivatedProjects',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Projects();
		},

		//
		// querying methods
		//

		getQueryString: function() {
			return this.projectFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.projectFilters.currentView.getData();
		},

		//
		// ajax methods
		//

		fetchProjects: function(done) {

			// fetch projects
			//
			this.collection.fetchAll({
				data: this.projectFilters.currentView? this.projectFilters.currentView.getAttrs() : null,

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
							message: "Could not fetch projects."
						})
					);
				}
			});	
		},

		saveProjects: function() {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "Project Changes Saved",
							message: "Your project changes have been successfully saved."
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Your project changes could not be saved."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(){
			return _.template(Template,{
				showDeactivatedProjects: this.options.showDeactivatedProjects ? true : false,
				showNumbering: Registry.application.options.showNumbering
			});
		},
		
		onRender: function() {

			// show project filters
			//
			this.showFilters();

			// show projects list
			//
			this.fetchAndShowList();
		},

		showFilters: function() {
			var self = this;

			// show project filters
			//
			this.projectFilters.show(
				new ProjectFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						// setQueryString(self.projectFilters.currentView.getQueryString());

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
			var self = this;

			// show review projects list
			//
			this.reviewProjectsList.show(
				new ReviewProjectsListView({
					collection: this.collection,
					showDeactivatedProjects: this.options.showDeactivatedProjects,
					showNumbering: Registry.application.options.showNumbering,

					// callbacks
					//
					onChange: function() {

						// enable save button
						//
						self.$el.find('#save').prop('disabled', false);
					}
				})
			);
		},

		fetchAndShowList: function() {
			var self = this;
			this.fetchProjects(function() {
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

		onClickSave: function() {

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);

			// save project info
			//
			this.saveProjects();
		},

		onClickCancel: function() {

			// return to overview
			//
			Backbone.history.navigate('#overview', {
				trigger: true
			});
		},

		onClickShowDeactivatedProjects: function(event) {
			this.options.showDeactivatedProjects = event.target.checked;
			this.render();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
