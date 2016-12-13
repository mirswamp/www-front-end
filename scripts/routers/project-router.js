/******************************************************************************\
|                                                                              |
|                                 project-router.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for project routes.          |
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
	'backbone'
], function($, _, Backbone) {

	function parseQueryString(queryString) {

		// parse query string
		//
		var data = queryStringToData(queryString);

		// parse limit
		//
		if (data['limit']) {
			if (data['limit'] != 'none') {
				data['limit'] = parseInt(data['limit']);
			} else {
				data['limit'] = null;
			}
		}

		return data;
	}

	// create router
	//
	return Backbone.Router.extend({

		//
		// route definitions
		//

		routes: {

			// project viewing and creation routes
			//
			'projects': 'showMyProjects',
			'projects/add': 'showAddNewProject',

			// project administration routes
			//
			'projects/review(?*query_string)': 'showReviewProjects',

			// project routes
			//
			'projects/:project_uid': 'showProject',
			'projects/:project_uid/edit': 'showEditProject',

			// project member routes
			//
			'projects/:project_uid/members/invite': 'showInviteProjectMembers',
			'projects/:project_uid/members/invite/confirm/:key': 'showConfirmProjectInvitation'
		},

		//
		// project viewing and creation route handlers
		//

		showMyProjects: function() {
			require([
				'registry',
				'views/projects/projects-view'
			], function (Registry, ProjectsView) {

				// show content view
				//
				Registry.application.showContent({
					nav1: 'home',
					nav2: 'projects', 

					// callbacks
					//
					done: function(view) {

						// show projects view
						//
						view.content.show(
							new ProjectsView()
						);
					}
				});
			});
		},

		showAddNewProject: function() {
			require([
				'registry',
				'views/projects/add/add-new-project-view'
			], function (Registry, AddNewProjectView) {

				// show content view
				//
				Registry.application.showContent({
					'nav1': 'home',
					'nav2': 'projects', 

					// callbacks
					//
					done: function(view) {

						// show add new project view
						//
						view.content.show(
							new AddNewProjectView({
								user: Registry.application.session.user
							})
						);
					}
				});
			});
		},

		//
		// project administration route handlers
		//

		showReviewProjects: function(queryString) {
			require([
				'registry',
				'utilities/browser/query-strings',
				'utilities/browser/url-strings',
				'views/projects/review/review-projects-view',
			], function (Registry, QueryStrings, UrlStrings, ReviewProjectsView) {

				// show content view
				//
				Registry.application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {

						// show review projects view
						//
						view.content.show(
							new ReviewProjectsView({
								data: parseQueryString(queryString)
							})
						);
					}
				});
			});
		},

		//
		// project route handlers
		//

		showProjectView: function(projectUid, options) {
			require([
				'registry',
				'models/projects/project',
				'views/dialogs/error-view'
			], function (Registry, Project, ErrorView) {

				// fetch project
				//
				var project = new Project({
					project_uid: projectUid
				});

				project.fetch({

					// callbacks
					//
					success: function() {

						// show content view
						//
						Registry.application.showContent({
							nav1: 'home',
							nav2: options.nav,

							// callbacks
							//
							done: function(view) {
								view.content.model = project;
								if (options.done) {
									options.done(view.content);
								}
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch project."
							})
						);
					}
				});
			});
		},

		showProject: function(projectUid, options) {
			var self = this;
			require([
				'config',
				'registry',
				'models/projects/project',
				'models/projects/project-membership',
				'views/dialogs/error-view',
				'views/projects/project-view'
			], function (Config, Registry, Project, ProjectMembership, ErrorView, ProjectView) {

				// show project view
				//
				self.showProjectView(projectUid, {
					nav: 'projects', 

					// callbacks
					//
					done: function(view) {

						// fetch project membership
						//
						var projectMembership = new ProjectMembership();
						var user = Registry.application.session.user;

						// fetch user's project membership
						//
						projectMembership.fetch({
							url: Config.servers.web + '/memberships/projects/' + view.model.get('project_uid') + '/users/' + user.get('user_uid'),

							// callbacks
							//
							success: function() {

								// show project view for members
								//
								view.show(
									new ProjectView({
										model: view.model,
										projectMembership: projectMembership
									})
								);
							},

							error: function() {

								// show project view for non-members
								//
								view.show(
									new ProjectView({
										model: view.model
									})
								);
							}
						});
					}
				});
			});
		},

		showEditProject: function(projectUid) {
			var self = this;
			require([
				'views/projects/info/edit-project-view'
			], function (EditProjectView) {

				// show project view
				//
				self.showProjectView(projectUid, {
					nav: 'projects', 

					// callbacks
					//
					done: function(view) {

						// show edit project view
						//
						view.show(
							new EditProjectView({
								model: view.model
							})
						);
					}
				});
			});
		},

		//
		// project project invitation route handlers
		//

		showInviteProjectMembers: function(projectUid) {
			var self = this;
			require([
				'views/projects/info/members/invitations/invite-project-members-view'
			], function (InviteProjectMembersView) {

				// show project view
				//
				self.showProjectView(projectUid, {
					nav: 'projects',

					// callbacks
					//
					done: function(view) {

						// show invite project members view
						//
						view.show(
							new InviteProjectMembersView({
								model: view.model
							})
						);
					}
				});
			});
		},

		showConfirmProjectInvitation: function(projectUid, invitationKey) {
			require([
				'registry',
				'models/projects/project-invitation',
				'views/projects/info/members/invitations/confirm-project-invitation-view',
				'views/projects/info/members/invitations/please-register-view',
				'views/projects/info/members/invitations/invalid-project-invitation-view'
			], function (Registry, ProjectInvitation, ConfirmProjectInvitationView, PleaseRegisterView, InvalidProjectInvitationView) {

				// fetch project invitation
				//
				var projectInvitation = new ProjectInvitation({
					'project_uid': projectUid,
					'invitation_key': invitationKey
				});

				projectInvitation.confirm({

					// callbacks
					//
					success: function(sender, project) {
						projectInvitation.confirmInvitee({

							// callbacks
							//
							success: function(invitee) {

								// show confirm project invitation view
								//
								Registry.application.showMain(
									new ConfirmProjectInvitationView({
										model: projectInvitation,
										sender: sender,
										project: project,
										user: invitee
									})
								);
							},

							error: function() {

								// show please register view
								//
								Registry.application.showMain(
									new PleaseRegisterView({
										model: projectInvitation,
										sender: sender,
										project: project
									})
								);
							}
						});
					},

					error: function(message) {

						// show invalid project invitation view
						//
						Registry.application.showMain(
							new InvalidProjectInvitationView({
								message: message
							})
						);	
					}
				});
			});
		}
	});
});


