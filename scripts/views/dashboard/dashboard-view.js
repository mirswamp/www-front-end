/******************************************************************************\
|                                                                              |
|                               dashboard-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dashboard view that shows a set a user actions.        |
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
	'text!templates/dashboard/dashboard.tpl',
	'collections/projects/projects',
	'collections/packages/packages',
	'collections/tools/tools',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/run-requests/run-request-schedules',
	'collections/assessments/scheduled-runs',
	'collections/events/user-events',
	'views/base-view',
	'utilities/time/date-utils'
], function($, _, Template, Projects, Packages, Tools, AssessmentRuns, ExecutionRecords, RunRequestSchedules, ScheduledRuns, UserEvents, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		className: 'dashboard',
		
		template: _.template(Template),

		events: {
			'click #my-account': 'onClickMyAccount',
			'click #sign-out': 'onClickSignOut'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				user: application.session.user,
				isAdmin: application.session.user.isAdmin()
			};
		},

		onRender: function() {
			var self = this;

			// fetch user's projects
			//
			var projects = new Projects();
			projects.fetchByUser(application.session.user, {

				// callbacks
				//
				success: function() {
					self.addBadges(projects);
				}
			});

			// show tools, if necessary
			//
			Tools.fetchNumByUser(application.session.user, {
				success: function(number) {
					if (number > 0) {
						self.$el.find("#tools").show();
					} else {
						self.$el.find("#tools").hide();
					}
				}
			});
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

		addNumPackagesBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				Packages.fetchNumAllProtected(projects, {
					success: function(number) {
						self.addBadge("#packages .icon", number);
					}
				});
			} else {
				this.addBadge("#packages .icon", 0);
			}			
		},

		addNumToolsBadge: function(projects) {
			var self = this;
			Tools.fetchNumByUser(application.session.user, {
				success: function(number) {
					self.addBadge("#tools .icon", number);
				}
			});
		},

		addNumAssessmentsBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				AssessmentRuns.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#assessments .icon", number);
					}
				});
			} else {
				this.addBadge("#assessments .icon", 0);
			}
		},

		addNumResultsBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				ExecutionRecords.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#results .icon", number);
					}
				});
			} else {
				this.addBadge("#results .icon", 0);
			}		
		},

		addNumSchedulesBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				RunRequestSchedules.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#schedules .icon", number);
					}
				});
			} else {
				this.addBadge("#schedules .icon", 0);
			}		
		},

		addNumRunsBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				ScheduledRuns.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#runs .icon", number);
					}
				});
			} else {
				this.addBadge("#runs .icon", 0);
			}		
		},

		addNumProjectsBadge: function(projects) {
			this.addBadge("#projects .icon", projects.length);
		},

		addNumEventsBadge: function(projects) {
			var self = this;
			UserEvents.fetchNumAll({
				success: function(number) {
					self.addBadge("#events .icon", number);
				}
			});			
		},

		addBadges: function(projects) {
			this.addNumPackagesBadge(projects);
			this.addNumToolsBadge(projects);
			this.addNumAssessmentsBadge(projects);
			this.addNumResultsBadge(projects);
			this.addNumSchedulesBadge(projects);
			this.addNumRunsBadge(projects);
			this.addNumProjectsBadge(projects);
			this.addNumEventsBadge(projects);
		},

		//
		// mouse event handling methods
		//

		onClickMyAccount: function() {
			application.navigate('#my-account');
		},

		onClickSignOut: function() {
			application.logout();
		}
	});
});
