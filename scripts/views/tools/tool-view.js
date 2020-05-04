/******************************************************************************\
|                                                                              |
|                                  tool-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a tools's information.              |
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
	'text!templates/tools/tool.tpl',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view'
], function($, _, Template, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			info: '#tool-info'
		},

		events: {
			'click #details': 'onClickDetails',
			'click #sharing': 'onClickSharing',
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				nav: this.options.nav,
				showSharing: this.model.isOwned()
			};
		},

		onRender: function() {
			var self = this;

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

		addNumAssessmentsBadge: function() {
			var self = this;
			if (projects.length > 0) {
				AssessmentRuns.fetchNumByProjects(projects, {
					data: {
						tool_uuid: this.model.get('tool_uuid')
					},
					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else {
				this.addBadge("#assessments", 0);
			}
		},

		addNumResultsBadge: function() {
			var self = this;
			if (projects.length > 0) {
				ExecutionRecords.fetchNumByProjects(projects, {
					data: {
						tool_uuid: this.model.get('tool_uuid')
					},
					success: function(number) {
						self.addBadge("#results", number);
					}
				});
			} else {
				this.addBadge("#results", 0);
			}		
		},

		addNumRunsBadge: function() {
			var self = this;
			if (projects.length > 0) {
				ScheduledRuns.fetchNumByProjects(projects, {
					data: {
						tool_uuid: this.model.get('tool_uuid')
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

		onClickDetails: function() {

			// go to tool details view
			//
			application.navigate('#tools/' + this.model.get('tool_uuid'));
		},

		onClickSharing: function() {

			// go to tool sharing view
			//
			application.navigate('#tools/' + this.model.get('tool_uuid') + '/sharing');
		},

		onClickAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments?tool=' + this.model.get('tool_uuid'));
		},

		onClickResults: function() {

			// go to assessment results view
			//
			application.navigate('#results?tool=' + this.model.get('tool_uuid'));
		},

		onClickRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests?tool=' + this.model.get('tool_uuid'));
		}
	});
});