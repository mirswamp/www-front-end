/******************************************************************************\
|                                                                              |
|                              platform-version-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a platform's version info.          |
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
	'text!templates/platforms/info/versions/platform-version/platform-version.tpl',
	'registry',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/platforms/info/versions/platform-version/platform-version-profile/platform-version-profile-view'
], function($, _, Backbone, Marionette, Template, Registry, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, PlatformVersionProfileView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			platformVersionProfile: '#platform-version-profile'
		},

		events: {
			'click #run-new-assessment': 'onClickRunNewAssessment',
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				platform: this.options.platform,
				name: this.options.platform.get('name'),
				isOwned: Registry.application.session.user.isAdmin(),
				showNavigation: this.options.showNavigation
			}));
		},

		onRender: function() {
			var self = this;
			
			// show tool version profile
			//
			this.platformVersionProfile.show(
				new PlatformVersionProfileView({
					model: this.model
				})
			);

			// fetch projects and add badges for projects info
			//
			var projects = new Projects();
			projects.fetch({

				// callbacks
				//
				success: function() {
					self.addBadges(projects);
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

			// add num assessments badge
			//
			if (projects.length > 0) {
				AssessmentRuns.fetchNumByProjects(projects, {
					data: {
						platform_version_uuid: this.model.get('platform_version_uuid')
					},
					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else {
				this.addBadge("#assessments", 0);
			}

			// add num results badge
			//
			if (projects.length > 0) {
				ExecutionRecords.fetchNumByProjects(projects, {
					data: {
						platform_version_uuid: this.model.get('platform_version_uuid')
					},
					success: function(number) {
						self.addBadge("#results", number);
					}
				});
			} else {
				this.addBadge("#results", 0);
			}

			// add num scheduled runs badge
			//
			if (projects.length > 0) {
				ScheduledRuns.fetchNumByProjects(projects, {
					data: {
						platform_version_uuid: this.model.get('platform_version_uuid')
					},
					success: function(number) {
						self.addBadge("#runs", number);
					}
				});
			} else {
				this.addBadge("#runs", 0);
			}
		},

		//
		// event handling methods
		//

		onClickRunNewAssessment: function() {

			// go to run new assessment view
			//
			Backbone.history.navigate('#assessments/run?platform-version=' + this.model.get('platform_version_uuid'), {
				trigger: true
			});
		},

		onClickAssessments: function() {

			// go to assessments view
			//
			Backbone.history.navigate('#assessments?platform-version=' + this.model.get('platform_version_uuid'), {
				trigger: true
			});
		},

		onClickResults: function() {

			// go to assessment results view
			//
			Backbone.history.navigate('#results?platform-version=' + this.model.get('platform_version_uuid'), {
				trigger: true
			});
		},

		onClickRuns: function() {

			// go to run requests view
			//
			Backbone.history.navigate('#run-requests?platform-version=' + this.model.get('platform_version_uuid'), {
				trigger: true
			});
		},

		onClickCancel: function() {

			// go to platform view
			//
			Backbone.history.navigate('#platforms/' + this.model.get('platform_uuid'), {
				trigger: true
			});
		}
	});
});
