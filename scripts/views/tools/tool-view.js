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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/tools/tool.tpl',
	'registry',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs'
], function($, _, Backbone, Marionette, Template, Registry, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			toolInfo: '#tool-info'
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				nav: this.options.nav,
				showSharing: this.model.isOwned()
			}));
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
						tool_uuid: this.model.get('tool_uuid')
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
						tool_uuid: this.model.get('tool_uuid')
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

		//
		// event handling methods
		//

		onClickDetails: function() {

			// go to tool details view
			//
			Backbone.history.navigate('#tools/' + this.model.get('tool_uuid'), {
				trigger: true
			});
		},

		onClickSharing: function() {

			// go to tool sharing view
			//
			Backbone.history.navigate('#tools/' + this.model.get('tool_uuid') + '/sharing', {
				trigger: true
			});
		},

		onClickAssessments: function() {

			// go to assessments view
			//
			Backbone.history.navigate('#assessments?tool=' + this.model.get('tool_uuid'), {
				trigger: true
			});
		},

		onClickResults: function() {

			// go to assessment results view
			//
			Backbone.history.navigate('#results?tool=' + this.model.get('tool_uuid'), {
				trigger: true
			});
		},

		onClickRuns: function() {

			// go to run requests view
			//
			Backbone.history.navigate('#run-requests?tool=' + this.model.get('tool_uuid'), {
				trigger: true
			});
		}
	});
});