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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/project.tpl',
	'collections/users/users',
	'collections/projects/projects',
	'collections/projects/project-memberships',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'collections/run-requests/run-requests',
	'collections/events/project-events',
	'collections/events/user-project-events',
	'views/base-view',
	'views/projects/info/project-profile/project-profile-view',
	'views/projects/info/members/list/project-members-list-view'
], function($, _, Template, Users, Projects, ProjectMemberships, AssessmentRuns, ExecutionRecords, ScheduledRuns, RunRequests, ProjectEvents, UserProjectEvents, BaseView, ProjectProfileView, ProjectMembersListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#project-profile',
			list: '#members-list'
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
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;
			this.collection = new ProjectMemberships();

			// find total number of projects
			//
			Projects.fetchNum({

				// callbacks
				//
				success: function(numProjects) {
					self.numProjects = parseInt(numProjects);
				}
			});
		},

		//
		// methods
		//

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

					// show error message
					//
					application.error({
						message: "Your project membership changes could not be saved."
					});
				}
			});
		},

		deleteProject: function() {
			var self = this;
			this.model.destroy({

				// callbacks
				//
				success: function() {

					// update user
					//
					self.numProjects--;
					application.session.user.set('num_projects', application.session.user.get('num_projects') - 1);

					// return to projects view
					//
					application.navigate('#projects');
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not delete this project."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function(data) {
			return {
				model: this.model,
				isOwned: this.model.isOwned(),
				isTrialProject: this.model.isTrialProject(),
				isDeactivated: this.model.isDeactivated(),
				isAdmin: application.session.isAdmin(),
				isProjectAdmin: application.session.isAdmin() ||
					this.options.projectMembership && this.options.projectMembership.isAdmin(),
				allowPublicTools: true
			};
		},

		onRender: function() {

			// display project profile view
			//
			this.showChildView('profile', new ProjectProfileView({
				model: this.model
			}));

			// show project members view
			//
			if (!this.model.isTrialProject()) {
				this.showProjectMembers();
			}

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
					self.showList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch project memberships."
					});
				}
			});
		},

		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			this.showChildView('list', new ProjectMembersListView({
				model: this.model,
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy,
				showEmail: application.config.email_enabled,
				showUsername: true,
				showDelete: this.options.projectMembership && this.options.projectMembership.isAdmin(),
				readOnly: !(application.session.isAdmin() ||
					this.options.projectMembership && this.options.projectMembership.isAdmin())
			}));

			// show count of project members
			//
			this.showNumberOfMembers(this.collection.length);
		},

		showNumberOfMembers: function(numberOfMembers) {
			this.$el.find('#number-of-members').html(numberOfMembers);
		},

		//
		// badge rendering methods
		//

		addBadge: function(selector, num) {
			if (num > 0) {
				this.$el.find(selector).append('<span class="badge">' + num + '</span>');
			} else {
				this.$el.find(selector).append('<span class="badge badge-important">' + num + '</span>');
			}
		},

		addNumAssessmentsBadge: function() {
			var self = this;
			AssessmentRuns.fetchNumByProject(this.model, {
				success: function(number) {
					self.addBadge("#assessments", number);
				}
			});
		},

		addNumResultsBadge: function() {
			var self = this;
			ExecutionRecords.fetchNumByProject(this.model, {
				success: function(number) {
					self.addBadge("#results", number);
				}
			});		
		},

		addNumRunsBadge: function() {
			var self = this;
			ScheduledRuns.fetchNumByProject(this.model, {
				success: function(number) {
					self.addBadge("#runs", number);
				}
			});		
		},

		addNumSchedulesBadge: function() {
			var self = this;
			RunRequests.fetchNumSchedulesByProject(this.model, {
				success: function(number) {
					self.addBadge("#schedules", number);
				}
			});		
		},

		addNumEventsBadge: function() {
			var self = this;
			UserProjectEvents.fetchNumByUser(this.model, application.session.user, {
				success: function(numUserProjectEvents) {
					self.addBadge("#events", numUserProjectEvents);
				}
			});	
		},

		addBadges: function() {
			this.addNumAssessmentsBadge();
			this.addNumResultsBadge();
			this.addNumRunsBadge();
			this.addNumSchedulesBadge();
			this.addNumEventsBadge();
		},

		//
		// event handling methods
		//

		onClickAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments?project=' + this.model.get('project_uid'));
		},

		onClickResults: function() {

			// go to assessment results view
			//
			application.navigate('#results?project=' + this.model.get('project_uid'));
		},

		onClickRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests?project=' + this.model.get('project_uid'));
		},

		onClickSchedules: function() {

			// go to run request schedules view
			//
			application.navigate('#run-requests/schedules?project=' + this.model.get('project_uid'));
		},

		onClickEvents: function() {

			// go to events view
			//
			application.navigate('#my-account/events?type=project&project=' + this.model.get('project_uid'));
		},

		onClickInvite: function() {

			// go to invite members view
			//
			application.navigate('#projects/' + this.model.get('project_uid') + '/members/invite');
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
			application.navigate('#assessments/run?project=' + this.model.get('project_uid'));
		},

		onClickEditProject: function() {

			// go to edit project view
			//
			application.navigate('#projects/' + this.model.get('project_uid') + '/edit');
		},

		onClickDeleteProject: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Project",
				message: "Are you sure that you would like to delete project " + self.model.get('full_name') + "? " +
					"When you delete a project, all of the project data will continue to be retained.",

				// callbacks
				//
				accept: function() {
					self.deleteProject();
				}
			});
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
			application.notify({
				message: "No changes made to project members to save."
			});
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
