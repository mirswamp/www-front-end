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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'routers/base-router'
], function($, _, BaseRouter) {

	function parseQueryString(queryString) {

		// parse query string
		//
		var data = queryStringToData(queryString);

		// parse limit
		//
		if (data.limit) {
			if (data.limit != 'none') {
				data.limit = parseInt(data.limit);
			} else {
				data.limit = null;
			}
		}

		return data;
	}

	// create router
	//
	return BaseRouter.extend({

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
				'views/projects/projects-view'
			], function (ProjectsView) {

				// show content view
				//
				application.showContent({
					nav1: 'home',
					nav2: 'projects', 

					// callbacks
					//
					done: function(view) {

						// show projects view
						//
						view.showChildView('content', new ProjectsView());
					}
				});
			});
		},

		showAddNewProject: function() {
			require([
				'views/projects/add/add-new-project-view'
			], function (AddNewProjectView) {

				// show content view
				//
				application.showContent({
					'nav1': 'home',
					'nav2': 'projects', 

					// callbacks
					//
					done: function(view) {

						// show add new project view
						//
						view.showChildView('content', new AddNewProjectView({
							user: application.session.user
						}));
					}
				});
			});
		},

		//
		// project administration route handlers
		//

		showReviewProjects: function(queryString) {
			require([
				'utilities/web/query-strings',
				'utilities/web/url-strings',
				'views/projects/review/review-projects-view',
			], function (QueryStrings, UrlStrings, ReviewProjectsView) {

				// show content view
				//
				application.showContent({
					'nav1': 'home',
					'nav2': 'overview', 

					// callbacks
					//
					done: function(view) {

						// show review projects view
						//
						view.showChildView('content', new ReviewProjectsView({
							data: parseQueryString(queryString)
						}));
					}
				});
			});
		},

		//
		// project route handlers
		//

		showProjectView: function(projectUid, options) {
			require([
				'models/projects/project',
			], function (Project) {

				// fetch project
				//
				var project = new Project({
					project_uid: projectUid
				});

				project.fetch({

					// callbacks
					//
					success: function(model) {

						// show content view
						//
						application.showContent({
							nav1: 'home',
							nav2: options.nav,

							// callbacks
							//
							done: function(view) {

								// set current project
								//
								view.model = model;
								// view.getChildView('content').model = project;

								// perform callback
								//
								if (options.done) {
									options.done(view);
								}
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch project."
						});
					}
				});
			});
		},

		showProject: function(projectUid, options) {
			var self = this;
			require([
				'config',
				'models/projects/project',
				'models/projects/project-membership',
				'views/projects/project-view'
			], function (Config, Project, ProjectMembership, ProjectView) {

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
						var user = application.session.user;

						// fetch user's project membership
						//
						projectMembership.fetch({
							url: Config.servers.web + '/memberships/projects/' + view.model.get('project_uid') + '/users/' + user.get('user_uid'),

							// callbacks
							//
							success: function() {

								// show project view for members
								//
								view.showChildView('content', new ProjectView({
									model: view.model,
									projectMembership: projectMembership
								}));
							},

							error: function() {

								// show project view for non-members
								//
								view.showChildView('content', new ProjectView({
									model: view.model
								}));
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
						view.showChildView('content', new EditProjectView({
							model: view.model
						}));
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
						view.showChildView('content', new InviteProjectMembersView({
							model: view.model
						}));
					}
				});
			});
		},

		showConfirmProjectInvitation: function(projectUid, invitationKey) {
			require([
				'models/projects/project-invitation',
				'views/projects/info/members/invitations/confirm-project-invitation-view',
				'views/projects/info/members/invitations/please-register-view',
				'views/projects/info/members/invitations/invalid-project-invitation-view'
			], function (ProjectInvitation, ConfirmProjectInvitationView, PleaseRegisterView, InvalidProjectInvitationView) {

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
								application.showMain(new ConfirmProjectInvitationView({
									model: projectInvitation,
									sender: sender,
									project: project,
									user: invitee
								}));
							},

							error: function() {

								// show please register view
								//
								application.showMain(new PleaseRegisterView({
									model: projectInvitation,
									sender: sender,
									project: project
								}));
							}
						});
					},

					error: function(message) {

						// show invalid project invitation view
						//
						application.showMain(new InvalidProjectInvitationView({
							message: message
						}));	
					}
				});
			});
		}
	});
});