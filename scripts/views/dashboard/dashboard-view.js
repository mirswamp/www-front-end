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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/dashboard/dashboard.tpl',
	'registry',
	'collections/projects/projects',
	'collections/tools/tools',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Template, Registry, Projects, Tools, NotifyView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #packages': 'onClickPackages',
			'click #tools': 'onClickTools',
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #projects': 'onClickProjects',
			'click #events': 'onClickEvents',
			'click #settings': 'onClickSettings',
			'click #overview': 'onClickOverview',
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
			require([
				'collections/packages/packages',
				'collections/assessments/assessment-runs',
				'collections/assessments/execution-records',
				'collections/assessments/scheduled-runs',
				'collections/events/user-events'
			], function (Packages, AssessmentRuns, ExecutionRecords, ScheduledRuns, UserEvents) {

				// add num packages badge
				//
				if (projects.length > 0) {
					Packages.fetchNumAllProtected(projects, {
						success: function(number) {
							self.addBadge("#packages .icon", number);
						}
					});
				} else {
					self.addBadge("#packages .icon", 0);
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
					self.addBadge("#assessments .icon", 0);
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
					self.addBadge("#results .icon", 0);
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
					self.addBadge("#runs .icon", 0);
				}

				// add num projects badge
				//
				self.addBadge("#projects .icon", projects.getNonTrialProjects().length);

				// add num events badge
				//
				UserEvents.fetchNumAll({
					success: function(number) {
						self.addBadge("#events .icon", number);
					}
				});
			});
		},

		//
		// event handling methods
		//

		onClickPackages: function() {

			// go to my packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});	
		},

		onClickTools: function() {

			// go to my tools view
			//
			Backbone.history.navigate('#tools', {
				trigger: true
			});	
		},

		onClickAssessments: function() {

			// go to my assessments view
			//
			Backbone.history.navigate('#assessments', {
				trigger: true
			});
		},

		onClickResults: function() {

			// go to my results view
			//
			Backbone.history.navigate('#results', {
				trigger: true
			});
		},

		onClickRuns: function() {

			// go to my scheduled runs view
			//
			Backbone.history.navigate('#run-requests', {
				trigger: true
			});
		},

		onClickProjects: function() {

			// go to my projects view
			//
			Backbone.history.navigate('#projects', {
				trigger: true
			});	
		},

		onClickEvents: function() {

			// go to my events view
			//
			Backbone.history.navigate('#events?project=any', {
				trigger: true
			});	
		},

		onClickSettings: function() {

			// go to system settings view
			//
			Backbone.history.navigate('#settings', {
				trigger: true
			});			
		},

		onClickOverview: function() {

			// go to system overview view
			//
			Backbone.history.navigate('#overview', {
				trigger: true
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
