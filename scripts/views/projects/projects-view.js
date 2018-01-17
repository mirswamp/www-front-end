/******************************************************************************\
|                                                                              |
|                                   projects-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a list of user projects.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/projects/projects.tpl',
	'registry',
	'models/permissions/user-permission',
	'collections/projects/projects',
	'views/dialogs/error-view',
	'views/projects/list/projects-list-view',
	'views/users/dialogs/project-ownership/project-ownership-policy-view',
	'views/users/dialogs/project-ownership/project-ownership-status-view'
], function($, _, Backbone, Marionette, Template, Registry, UserPermission, Projects, ErrorView, ProjectsListView, ProjectOwnershipPolicyView, ProjectOwnershipStatusView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			ownedProjectsList: '#owned-projects-list',
			joinedProjectsList: '#joined-projects-list'
		},

		events: {
			'click #add-new-project': 'onClickAddNewProject',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Projects();
		},

		addProject: function() {
			Backbone.history.navigate('#projects/add', {
				trigger: true
			});
		},

		//
		// ajax methods
		//

		fetchProjects: function(done) {
			this.collection.fetch({

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
							message: "Could not fetch list of projects."
						})
					);
				}
			})
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {
			var self = this;

			// fetch and show projects
			//
			this.fetchProjects(function() {
				self.showLists();
			});
		},

		showLists: function() {

			// show list of owned projects
			//
			this.ownedProjectsList.show(
				new ProjectsListView({
					collection: this.collection.getNonTrialProjects().getProjectsOwnedBy(Registry.application.session.user),
					showNumbering: Registry.application.options.showNumbering,
					showDelete: true
				})
			);

			// show list of joined projects
			//
			this.joinedProjectsList.show(
				new ProjectsListView({
					collection: this.collection.getNonTrialProjects().getProjectsNotOwnedBy(Registry.application.session.user),
					showNumbering: Registry.application.options.showNumbering,
					showDelete: true
				})
			);
		},

		//
		// event handling methods
		//

		onClickAddNewProject: function() {
			this.addProject();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showLists();
		}
	});
});
