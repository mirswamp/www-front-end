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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/dashboard/dashboard.tpl',
	'registry',
	'collections/projects/projects',
	'collections/packages/packages',
	'collections/tools/tools',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'collections/events/user-events',
	'views/dialogs/notify-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Registry, Projects, Packages, Tools, AssessmentRuns, ExecutionRecords, ScheduledRuns, UserEvents, NotifyView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		className: 'dashboard',
		
		events: {
			'click #my-account': 'onClickMyAccount',
			'click #sign-out': 'onClickSignOut'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				user: Registry.application.session.user,
				isAdmin: Registry.application.session.user.isAdmin()
			});
		},

		onRender: function() {
			var self = this;

			// fetch user's projects
			//
			var projects = new Projects();
			projects.fetchByUser(Registry.application.session.user, {

				// callbacks
				//
				success: function() {
					self.addBadges(projects);
				}
			});

			// show tools, if necessary
			//
			Tools.fetchNumByUser(Registry.application.session.user, {
				success: function(number) {
					if (number > 0) {
						self.$el.find("#tools").show();
					} else {
						self.$el.find("#tools").hide();
					}
				}
			});
		},

		addBadge: function(selector, num) {
			if (num > 0) {
				this.$el.find(selector).append('<span class="badge">' + num + '</span>');
			} else {
				this.$el.find(selector).append('<span class="badge badge-important">' + num + '</span>');
			}
		},

		addBadges: function(projects) {
			var self = this;
			
			// add num packages badge
			//
			if (projects.length > 0) {
				Packages.fetchNumAllProtected(projects, {
					success: function(number) {
						self.addBadge("#packages .icon", number);
					}
				});
			} else {
				this.addBadge("#packages .icon", 0);
			}

			// add num tools badge
			//
			Tools.fetchNumByUser(Registry.application.session.user, {
				success: function(number) {
					self.addBadge("#tools .icon", number);
				}
			});

			// add num assessments badge
			//
			if (projects.length > 0) {
				AssessmentRuns.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#assessments .icon", number);
					}
				});
			} else {
				this.addBadge("#assessments .icon", 0);
			}

			// add num results badge
			//
			if (projects.length > 0) {
				ExecutionRecords.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#results .icon", number);
					}
				});
			} else {
				this.addBadge("#results .icon", 0);
			}

			// add num scheduled runs badge
			//
			if (projects.length > 0) {
				ScheduledRuns.fetchNumByProjects(projects, {
					success: function(number) {
						self.addBadge("#runs .icon", number);
					}
				});
			} else {
				this.addBadge("#runs .icon", 0);
			}

			// add num projects badge
			//
			this.addBadge("#projects .icon", projects.length);

			// add num events badge
			//
			UserEvents.fetchNumAll({
				success: function(number) {
					self.addBadge("#events .icon", number);
				}
			});
		},

		onClickMyAccount: function() {
			Backbone.history.navigate('#my-account', {
				trigger: true
			});
		},

		onClickSignOut: function() {
			Registry.application.logout();
		}
	});
});
