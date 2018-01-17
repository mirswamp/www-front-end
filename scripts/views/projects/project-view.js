/******************************************************************************\
|                                                                              |
|                                  project-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project's profile info.           |
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
	'text!templates/projects/project.tpl',
	'registry',
	'collections/users/users',
	'collections/projects/project-memberships',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'collections/run-requests/run-requests',
	'collections/events/project-events',
	'collections/events/user-project-events',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
	'views/projects/info/project-profile/project-profile-view',
	'views/projects/info/members/list/project-members-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Users, ProjectMemberships, AssessmentRuns, ExecutionRecords, ScheduledRuns, RunRequests, ProjectEvents, UserProjectEvents, ConfirmView, NotifyView, ErrorView, ProjectProfileView, ProjectMembersListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectProfile: '#project-profile',
			membersList: '#members-list'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #schedules': 'onClickSchedules',
			'click #events': 'onClickEvents',
			'click #invite': 'onClickInvite',
			'click input': 'onClickCheck',
			'click #run-new-assessment': 'onClickRunNewAssessment',
			'click #edit-project': 'onClickEditProject',
			'click #delete-project': 'onClickDeleteProject',
			'click #save-changes:not(.disabled)': 'onClickSaveChanges',
			'click #save-changes.disabled': 'onClickSaveChangesDisabled',
			'click #cancel': 'onClickCancel',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new ProjectMemberships();
		},

		saveProjectMemberships: function(done) {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// perform callback
					//
					if (done) {
						done();
					}
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

		deleteProject: function() {
			this.model.destroy({

				// callbacks
				//
				success: function() {

					// return to projects view
					//
					Backbone.history.navigate('#projects', {
						trigger: true
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not delete this project."
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
				model: this.model,
				isOwned: this.model.isOwned(),
				isTrialProject: this.model.isTrialProject(),
				isAdmin: Registry.application.session.isAdmin(),
				isProjectAdmin: Registry.application.session.isAdmin() ||
					this.options.projectMembership && this.options.projectMembership.isAdmin(),
				allowPublicTools: true,
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {

			// display project profile view
			//
			this.projectProfile.show(
				new ProjectProfileView({
					model: this.model
				})
			);

			// show project members view
			//
			this.showProjectMembers();

			// and add count bubbles / badges for project info
			//
			this.addBadges();
		},

		showProjectMembers: function() {
			var self = this;

			// get list of project's user memberships
			//
			this.collection.fetchByProject(this.model, {

				// callbacks
				//
				success: function() {

					// get the list of members
					//
					self.users = new Users();
					self.users.fetchByProject(self.model, {

						// callbacks
						//
						success: function() {
							self.showList();
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

		showList: function() {
			this.membersList.show(
				new ProjectMembersListView({
					model: this.model,
					collection: this.users,
					currentProjectMembership: this.options.projectMembership,
					projectMemberships: this.collection,
					showEmail: Registry.application.config['email_enabled'],
					showUsername: true,
					showDelete: this.options.projectMembership && this.options.projectMembership.isAdmin(),
					showNumbering: Registry.application.options.showNumbering,
					readOnly: !(Registry.application.session.isAdmin() ||
						this.options.projectMembership && this.options.projectMembership.isAdmin())
				})
			);

			// show count of project members
			//
			this.showNumberOfMembers(this.collection.length);
		},

		showNumberOfMembers: function(numberOfMembers) {
			this.$el.find('#number-of-members').html(numberOfMembers);
		},

		addBadge: function(selector, num) {
			if (num > 0) {
				this.$el.find(selector).append('<span class="badge">' + num + '</span>');
			} else {
				this.$el.find(selector).append('<span class="badge badge-important">' + num + '</span>');
			}
		},

		addBadges: function() {
			var self = this;

			// add num assessments badge
			//
			AssessmentRuns.fetchNumByProject(this.model, {
				success: function(number) {
					self.addBadge("#assessments", number);
				}
			});

			// add num results badge
			//
			ExecutionRecords.fetchNumByProject(this.model, {
				success: function(number) {
					self.addBadge("#results", number);
				}
			});

			// add num scheduled runs badge
			//
			ScheduledRuns.fetchNumByProject(this.model, {
				success: function(number) {
					self.addBadge("#runs", number);
				}
			});

			// add num schedules badge
			//
			RunRequests.fetchNumSchedulesByProject(this.model, {
				success: function(number) {
					self.addBadge("#schedules", number);
				}
			});

			// add num events badge
			//
			ProjectEvents.fetchNumByUser(this.model, Registry.application.session.user, {
				success: function(numProjectEvents) {
					UserProjectEvents.fetchNumByUser(self.model, Registry.application.session.user, {
						success: function(numUserProjectEvents) {
							self.addBadge("#events", numProjectEvents + numUserProjectEvents);
						}
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickAssessments: function() {

			// go to assessments view
			//
			Backbone.history.navigate('#assessments?project=' + this.model.get('project_uid'), {
				trigger: true
			});
		},

		onClickResults: function() {

			// go to assessment results view
			//
			Backbone.history.navigate('#results?project=' + this.model.get('project_uid'), {
				trigger: true
			});
		},

		onClickRuns: function() {

			// go to run requests view
			//
			Backbone.history.navigate('#run-requests?project=' + this.model.get('project_uid'), {
				trigger: true
			});
		},

		onClickSchedules: function() {

			// go to run request schedules view
			//
			Backbone.history.navigate('#run-requests/schedules?project=' + this.model.get('project_uid'), {
				trigger: true
			});
		},

		onClickEvents: function() {

			// go to events view
			//
			Backbone.history.navigate('#events?type=project&project=' + this.model.get('project_uid'), {
				trigger: true
			});
		},

		onClickInvite: function() {

			// go to invite members view
			//
			Backbone.history.navigate('#projects/' + this.model.get('project_uid') + '/members/invite', {
				trigger: true
			});
		},

		onClickCheck: function() {
			var changed = this.collection.any(function(item) {
				return item.hasChanged();
			});
			
			// enable / disable save changes button
			//
			this.$el.find('#save-changes').prop('disabled', !changed);
		},

		onClickRunNewAssessment: function() {

			// go to run new assessment view
			//
			Backbone.history.navigate('#assessments/run?project=' + this.model.get('project_uid'), {
				trigger: true
			});
		},

		onClickEditProject: function() {

			// go to edit project view
			//
			Backbone.history.navigate('#projects/' + this.model.get('project_uid') + '/edit', {
				trigger: true
			});
		},

		onClickDeleteProject: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Project",
					message: "Are you sure that you would like to delete project " + self.model.get('full_name') + "? " +
						"When you delete a project, all of the project data will continue to be retained.",

					// callbacks
					//
					accept: function() {
						self.deleteProject();
					}
				})
			);
		},

		onClickSaveChanges: function() {
			var self = this;

			// disable save changes button
			//
			this.$el.find('#save-changes').prop('disabled', true);

			// save changes
			//
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

		onClickCancel: function() {
			Backbone.history.navigate('#projects', {
				trigger: true
			});			
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
