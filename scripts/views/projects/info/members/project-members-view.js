/******************************************************************************\
|                                                                              |
|                             project-members-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's membership.             |
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
	'text!templates/projects/info/members/project-members.tpl',
	'config',
	'registry',
	'models/projects/project-membership',
	'collections/users/users',
	'collections/projects/project-memberships',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/projects/info/members/list/project-members-list-view'
], function($, _, Backbone, Marionette, Template, Config, Registry, ProjectMembership, Users, ProjectMemberships, ErrorView, NotifyView, ProjectMembersListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			membersList: '#members-list'
		},

		events: {
			'click input':   'onClickCheck',
			'click #invite': 'onClickInvite',
			'click #submit:not(.disabled)': 'onClickSubmit',
			'click #submit.disabled': 'onClickSubmitDisabled'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new ProjectMemberships();
		},

		saveProjectMemberships: function() {
			var self = this;
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notify view
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "Project Memberships Changed",
							message: "Your project membership changes have been saved.",

							// callbacks
							//
							accept: function() {
								self.render();
							}
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Your project membership changes could not be saved."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			var isOwned = this.model.isOwned();
			var isAdmin = Registry.application.session.isAdmin() ||
				this.options.projectMembership && this.options.projectMembership.isAdmin();
			return _.template(Template, _.extend(data, {
				isAdmin: isOwned || isAdmin,
				isTrialProject: this.model.isTrialProject()
			}));
		},

		onRender: function() {
			var self = this;

			this.disableSaveButton();

			// get list of project's user memberships
			//
			this.collection.fetchByProject(this.model, {

				// callbacks
				//
				success: function() {

					// get the list of members
					//
					var users = new Users();
					users.fetchByProject(self.model, {

						// callbacks
						//
						success: function() {
							self.membersList.show(
								new ProjectMembersListView({
									model: self.model,
									collection: users,
									currentProjectMembership: self.options.projectMembership,
									projectMemberships: self.collection,
									showEmail: this.options.showEmail,
									showUsername: this.options.showUsername,
									showDelete: currentProjectMembership && currentProjectMembership.isAdmin(),
									showNumbering: Registry.application.options.showNumbering
								})
							);
						},

						error: function() {

							// show error dialog
							//
							Registry.application.modal.show(
								new ErrorView({
									message: "Could not fetch project users."
								})
							);
						}
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch project memberships."
						})
					);
				}
			});
		},

		//
		// event handling methods
		//

		onClickCheck: function() {
			var changed = this.collection.any(function(item) { return item.hasChanged(); });
			if(changed) {
				this.enableSaveButton();
			}
			else {
				this.disableSaveButton();
			}
		},

		onClickInvite: function() {
			Backbone.history.navigate('#projects/' + this.model.get('project_uid') + '/members/invite', {
				trigger: true
			});
		},

		onClickSubmit: function() {
			this.saveProjectMemberships();
		},

		onClickSubmitDisabled: function() {

			// show no changes notification view
			//
			Registry.application.modal.show(
				new NotifyView({
					message: "No changes made to project members to save."
				})
			);
		},

		enableSaveButton: function() {
			this.$el.find('#submit').removeClass('disabled');
		},

		disableSaveButton: function() {
			this.$el.find('#submit').addClass('disabled');
		}
	});
});
