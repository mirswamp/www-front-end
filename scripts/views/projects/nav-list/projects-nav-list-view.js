/******************************************************************************\
|                                                                              |
|                             projects-nav-list-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing lists of the user's projects.       |
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
	'text!templates/projects/nav-list/projects-nav-list.tpl',
	'models/permissions/user-permission',
	'views/base-view',
	'views/users/dialogs/project-ownership/project-ownership-policy-dialog-view',
	'views/users/dialogs/project-ownership/project-ownership-status-dialog-view'
], function($, _, Template, UserPermission, ProjectOwnershipPolicyDialogView, ProjectOwnershipStatusDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #add-new-project': 'onClickAddNewProject',
			'click #review-projects': 'onClickReviewProjects'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				user: application.session.user,
				ownedProjects: this.collection.getOwnedBy(application.session.user),
				joinedProjects: this.collection.getNotOwnedBy(application.session.user)
			};
		},

		onRender: function() {

			// update sidebar navigation highlighting
			//
			if (this.options.nav) {
				this.$el.find('.nav li').removeClass('active');
				this.$el.find('.nav li.' + this.options.nav).addClass('active');
			}
		},

		//
		// event handling methods
		//

		onClickAddNewProject: function() {

			// check to see if user has project owner permissions
			//
			if (application.session.user.isOwner()) {
				Backbone.history.navigate('#projects/add', {
					trigger: true
				});
			} else {

				// fetch then render
				//
				var project_owner_permission = new UserPermission({ 
					'user_uid': application.session.user.get('user_uid'),
					'permission_code': 'project-owner'
				});
				project_owner_permission.fetch({

					// callbacks
					//
					success: function() {

						// show project ownership status dialog
						//
						application.show(new ProjectOwnershipStatusDialogView({
							model: project_owner_permission
						}));
					},

					error: function() {

						// show project ownership policy dialog
						//
						application.show(new ProjectOwnershipPolicyDialogView({
							model: project_owner_permission,
						}), {
							size: 'large'
						});
					}
				});			
			}
		},

		onClickReviewProjects: function() {
			Backbone.history.navigate('#projects/review', {
				trigger: true
			});	
		}
	});
});
