/******************************************************************************\
|                                                                              |
|                           invite-project-members-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for inviting new project members.               |
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
	'text!templates/projects/info/members/invitations/invite-project-members.tpl',
	'registry',
	'models/projects/project-invitation',
	'collections/projects/project-invitations',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/projects/info/members/invitations/project-invitations-list/project-invitations-list-view',
	'views/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list-view',
], function($, _, Backbone, Marionette, Template, Registry, ProjectInvitation, ProjectInvitations, NotifyView, ErrorView, ProjectInvitationsListView, NewProjectInvitationsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectInvitationsList: '#project-invitations-list',
			newProjectInvitationsList: '#new-project-invitations-list'
		},

		events: {
			'click #add': 'onClickAdd',
			'click #send.disabled': 'onClickSendDisabled',
			'click #send:not(.disabled)': 'onClickSend',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// create collection of invitations
			//
			this.collection = new ProjectInvitations([]);

			this.collection.bind('remove', function() {
				if (self.collection.length === 0) {
					self.disableSaveButton();
				}
			}, this);

			this.collection.bind('add', function() {
				self.enableSaveButton();
			}, this);
		},

		send: function() {
			var self = this;

			// check form validation
			//
			if (this.newProjectInvitationsList.currentView.isValid()) {
				if (this.collection.length > 0) {
					this.collection.send({

						// callbacks
						//
						success: function() {

							// update sent project invitations list
							//
							self.fetchAndShowProjectInvitations();

							// show success notification dialog
							//
							Registry.application.modal.show(
								new NotifyView({
									title: "Project Invitations Sent",
									message: "Your invitations to project " + self.model.get('full_name') + " have been successfully sent to all recipients."
								})
							);
						},

						error: function(response) {

							// update sent project invitations list
							//
							self.fetchAndShowProjectInvitations();

							// display error message
							//
							var message = "Could not send project invitations";
							if (response.status != 500 && response.responseText != "") {
								var errorMessages = JSON.parse(response.responseText);

								if (errorMessages.length > 0) {
									var errorMessage = errorMessages.join();
								} else if (typeof errorMessages == 'object') {
									var errorMessage = errorMessages.error.message;
								}

								// uncapitalize first letter
								//
								errorMessage = errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1);

								// add to message
								//
								message += " because " + errorMessage;
							}

							// show notification dialog
							//
							Registry.application.modal.show(
								new NotifyView({
									message: message
								})
							);
						}
					});
				}
			}
		},

		//
		// ajax methods
		//

		fetchProjectInvitations: function(done) {
			var self = this;
			var collection = new ProjectInvitations([]);

			// fetch project invitations
			//
			collection.fetchByProject(this.model, {

				// callbacks
				//
				success: function() {
					done(collection);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch project invitations."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {

			// show old and new project invitations
			//
			this.fetchAndShowProjectInvitations();
			this.showNewProjectInvitations();

			if (this.collection.length === 0) {
				this.disableSaveButton();
			}
		},

		enableSaveButton: function() {
			this.$el.find('#send').removeClass('disabled');
		},

		disableSaveButton: function() {
			this.$el.find('#send').addClass('disabled');
		},

		showProjectInvitations: function(collection) {
			this.projectInvitationsList.show(
				new ProjectInvitationsListView({
					model: this.model,
					collection: collection,
					showDelete: true
				})
			);
		},

		showNewProjectInvitations: function() {
			this.newProjectInvitationsList.show(
				new NewProjectInvitationsListView({
					model: this.model,
					collection: this.collection,
					showDelete: true
				})
			);
		},

		fetchAndShowProjectInvitations: function() {
			var self = this;
			this.fetchProjectInvitations(function(collection) {
				self.showProjectInvitations(collection);
			});
		},

		//
		// event handling methods
		//

		onClickAdd: function() {
			var user = Registry.application.session.user;

			// add new project invitation
			//
			this.collection.add(new ProjectInvitation({
				'project_uid': this.model.get('project_uid'),
				'inviter_uid': user.get('user_uid'),
				'status': 'pending',
				'confirm_route': '#projects/' + this.model.get('project_uid') +'/members/invite/confirm',
				'register_route': '#register'
			}));

			// update view
			//
			this.newProjectInvitationsList.currentView.render();
		},

		onClickSend: function() {
			this.send();
		},

		onClickSendDisabled: function() {

			// show no invitatoins dialog
			//
			Registry.application.modal.show(
				new NotifyView({
					message: "There are no project invitations to send."
				})
			);
		},

		onClickCancel: function() {

			// go to project view
			//
			Backbone.history.navigate('#projects/' + this.model.get('project_uid'), {
				trigger: true
			});
		}
	});
});
