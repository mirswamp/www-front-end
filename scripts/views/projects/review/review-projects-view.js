/******************************************************************************\
|                                                                              |
|                            review-projects-view.js                           |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/review/review-projects.tpl',
	'collections/projects/projects',
	'views/base-view',
	'views/projects/filters/project-filters-view',
	'views/projects/review/review-projects-list/review-projects-list-view'
], function($, _, Template, Projects, BaseView, ProjectFiltersView, ReviewProjectsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#project-filters',
			list: '#review-projects-list'
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
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},

		//
		// ajax methods
		//

		fetchProjects: function(done) {
			this.collection.reset();
			
			// fetch projects
			//
			this.collection.fetchAll({
				data: this.getChildView('filters')? this.getChildView('filters').getAttrs() : null,

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch projects."
					});
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
					application.notify({
						title: "Project Changes Saved",
						message: "Your project changes have been successfully saved."
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Your project changes could not be saved."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				showDeactivatedProjects: this.options.showDeactivatedProjects ? true : false
			};
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
			this.showChildView('filters', new ProjectFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
					// setQueryString(self.getChildView('filters').getQueryString());

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
			var self = this;

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show review projects list
			//
			this.showChildView('list', new ReviewProjectsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				showDeactivatedProjects: this.options.showDeactivatedProjects,

				// callbacks
				//
				onChange: function() {

					// enable save button
					//
					self.$el.find('#save').prop('disabled', false);
				}
			}));
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
			application.navigate('#overview');
		},

		onClickShowDeactivatedProjects: function(event) {
			this.options.showDeactivatedProjects = event.target.checked;
			this.render();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
