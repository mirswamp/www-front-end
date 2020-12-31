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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/platforms/info/versions/platform-version/platform-version.tpl',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view',
	'views/platforms/info/versions/platform-version/platform-version-profile/platform-version-profile-view'
], function($, _, Template, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView, PlatformVersionProfileView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#platform-version-profile'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				platform_name: this.options.platform.get('name'),
				platform_url: this.options.platform.getAppUrl(),
				isOwned: application.session.user.isAdmin(),
				showNavigation: this.options.showNavigation
			};
		},

		onRender: function() {
			var self = this;
			
			// show tool version profile
			//
			this.showChildView('profile', new PlatformVersionProfileView({
				model: this.model
			}));

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

		addNumAssessmentsBadge: function(projects) {
			var self = this;
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
		},

		addNumResultsBadge: function(projects) {
			var self = this;
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
		},

		addNumRunsBadge: function(projects) {
			var self = this;
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

		addBadges: function(projects) {
			this.addNumAssessmentsBadge(projects);
			this.addNumResultsBadge(projects);
			this.addNumRunsBadge(projects);
		},

		//
		// event handling methods
		//

		onClickAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments?platform-version=' + this.model.get('platform_version_uuid'));
		},

		onClickResults: function() {

			// go to assessment results view
			//
			application.navigate('#results?platform-version=' + this.model.get('platform_version_uuid'));
		},

		onClickRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests?platform-version=' + this.model.get('platform_version_uuid'));
		},

		onClickCancel: function() {

			// go to platform view
			//
			application.navigate('#platforms/' + this.model.get('platform_uuid'));
		}
	});
});
