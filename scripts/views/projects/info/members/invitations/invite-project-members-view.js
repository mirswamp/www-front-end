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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/invitations/invite-project-members.tpl',
	'models/projects/project-invitation',
	'collections/projects/project-invitations',
	'views/base-view',
	'views/projects/info/members/invitations/project-invitations-list/project-invitations-list-view',
	'views/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list-view',
], function($, _, Template, ProjectInvitation, ProjectInvitations, BaseView, ProjectInvitationsListView, NewProjectInvitationsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#project-invitations-list',
			new_list: '#new-project-invitations-list'
		},

		events: {
			'click #add': 'onClickAdd',
			'click #send.disabled': 'onClickSendDisabled',
			'click #send:not(.disabled)': 'onClickSend',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
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

		//
		// methods
		//

		send: function() {
			var self = this;

			// check form validation
			//
			if (this.getChildView('new_list').isValid()) {
				this.getChildView('new_list').update();

				if (this.collection.length > 0) {
					this.collection.send({

						// callbacks
						//
						success: function() {

							// update sent project invitations list
							//
							self.fetchAndShowProjectInvitations();

							// show success notification message
							//
							application.notify({
								title: "Project Invitations Sent",
								message: "Your invitations to project " + self.model.get('full_name') + " have been successfully sent to all recipients."
							});
						},

						error: function(response) {

							// update sent project invitations list
							//
							self.fetchAndShowProjectInvitations();

							// display error message
							//
							var message = "Could not send project invitations";
							if (response.status != 500 && response.responseText != "") {

								if (response.responseText.startsWith('{')) {
									var json = JSON.parse(response.responseText);
									if (json.error) {
										response.responseText = json.error.message;
									}
								}

								// add to message
								//
								message += " because " + response.responseText;
							}

							// show notification
							//
							application.notify({
								message: message
							});
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

					// show error message
					//
					application.error({
						message: "Could not fetch project invitations."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
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
			this.showChildView('list', new ProjectInvitationsListView({
				model: this.model,
				collection: collection,
				showDelete: true
			}));
		},

		showNewProjectInvitations: function() {
			this.showChildView('new_list', new NewProjectInvitationsListView({
				model: this.model,
				collection: this.collection,
				showDelete: true
			}));
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
			var user = application.session.user;

			// add new project invitation
			//
			this.collection.add(new ProjectInvitation({
				'project_uid': this.model.get('project_uid'),
				'inviter_uid': user.get('user_uid'),
				'status': 'pending',
				'confirm_route': '#projects/' + this.model.get('project_uid') +'/members/invite/confirm',
				'register_route': '#register'
			}));
		},

		onClickSend: function() {
			this.send();
		},

		onClickSendDisabled: function() {

			// show no invitations notification message
			//
			application.notify({
				message: "There are no project invitations to send."
			});
		},

		onClickCancel: function() {

			// go to project view
			//
			application.navigate('#projects/' + this.model.get('project_uid'));
		}
	});
});
