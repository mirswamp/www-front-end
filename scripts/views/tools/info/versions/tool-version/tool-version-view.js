/******************************************************************************\
|                                                                              |
|                                tool-version-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a tool's version info.              |
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
	'text!templates/tools/info/versions/tool-version/tool-version.tpl',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view',
	'views/tools/info/versions/tool-version/tool-version-profile/tool-version-profile-view'
], function($, _, Template, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView, ToolVersionProfileView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#tool-version-profile'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #edit': 'onClickEdit',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				tool: this.options.tool,
				name: this.options.tool.get('name'),
				isOwned: application.session.user.isAdmin(),
				showNavigation: this.options.showNavigation
			};
		},

		onRender: function() {
			var self = this;
			
			// show tool version profile
			//
			this.showChildView('profile', new ToolVersionProfileView({
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
						tool_version_uuid: this.model.get('tool_version_uuid')
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
						tool_version_uuid: this.model.get('tool_version_uuid')
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
						tool_version_uuid: this.model.get('tool_version_uuid')
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
			this.addNumAssessmentsBadge();
			this.addNumResultsBadge();
			this.addNumRunsBadge();
		},

		//
		// event handling methods
		//

		onClickAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments?tool-version=' + this.model.get('tool_version_uuid'));
		},

		onClickResults: function() {

			// go to assessment results view
			//
			application.navigate('#results?tool-version=' + this.model.get('tool_version_uuid'));
		},

		onClickRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests?tool=' + this.model.get('tool_uuid'));
		},

		onClickEdit: function() {

			// go to edit tool version view
			//
			application.navigate('#tools/versions/' + this.model.get('tool_version_uuid') + '/edit');
		},

		onClickCancel: function() {

			// go to tool view
			//
			application.navigate('#tools/' + this.model.get('tool_uuid'));
		}
	});
});
