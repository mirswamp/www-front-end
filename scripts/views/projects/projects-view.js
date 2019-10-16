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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/projects.tpl',
	'models/permissions/user-permission',
	'collections/projects/projects',
	'views/base-view',
	'views/projects/list/projects-list-view'
], function($, _, Template, UserPermission, Projects, BaseView, ProjectsListView) {
	return BaseView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		regions: {
			owned: '#owned-projects-list',
			joined: '#joined-projects-list'
		},

		events: {
			'click #add-new-project': 'onClickAddNewProject',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Projects();
		},

		//
		// methods
		//

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

					// show error message
					//
					application.error({
						message: "Could not fetch list of projects."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				showNumbering: application.options.showNumbering
			};
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
			this.showChildView('owned', new ProjectsListView({
				collection: this.collection.getOwnedBy(application.session.user),
				showNumbering: application.options.showNumbering,
				showDelete: true
			}));

			// show list of joined projects
			//
			this.showChildView('joined', new ProjectsListView({
				collection: this.collection.getNotOwnedBy(application.session.user),
				showNumbering: application.options.showNumbering,
				showDelete: true
			}));
		},

		//
		// event handling methods
		//

		onClickAddNewProject: function() {
			this.addProject();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
			this.showLists();
		}
	});
});
