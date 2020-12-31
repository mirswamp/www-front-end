/******************************************************************************\
|                                                                              |
|                           scheduled-runs-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single scheduled run list item.     |
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
	'text!templates/scheduled-runs/list/scheduled-runs-list-item.tpl',
	'models/packages/package',
	'models/packages/package-version',
	'models/tools/tool',
	'models/tools/tool-version',
	'models/platforms/platform',
	'models/platforms/platform-version',
	'models/assessments/assessment-run',
	'models/run-requests/run-request',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, Package, PackageVersion, Tool, ToolVersion, Platform, PlatformVersion, AssessmentRun, RunRequest, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// querying methods
		//

		getProjectUrl: function() {
			if (this.model.has('project_uuid')) {
				return application.getURL() + '#projects/' + this.model.get('project_uuid');
			}
		},

		getPackageUrl: function() {
			if (this.model.has('package_uuid')) {
				return application.getURL() + '#packages/' + this.model.get('package_uuid');
			}
		},

		getPackageVersionUrl: function() {
			if (this.model.has('package_version_uuid')) {
				return application.getURL() + '#packages/versions/' + this.model.get('package_version_uuid');
			}
		},

		getToolUrl: function() {
			if (this.model.has('tool_uuid')) {
				return application.getURL() + '#tools/' + this.model.get('tool_uuid');
			}
		},

		getToolVersionUrl: function() {
			if (this.model.has('tool_version_uuid')) {
				return application.getURL() + '#tools/versions/' + this.model.get('tool_version_uuid');
			}
		},

		getPlatformUrl: function() {
			if (this.model.has('platform_uuid')) {
				return application.getURL() + '#platforms/' + this.model.get('platform_uuid');
			}
		},

		getPlatformVersionUrl: function() {
			if (this.model.has('platform_version_uuid')) {
				return application.getURL() + '#platforms/versions/' + this.model.get('platform_version_uuid');
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var runRequest = this.model.get('run_request');

			return {
				runRequest: runRequest,

				// urls
				//
				runRequestUrl: '#run-requests/schedules/' + runRequest.get('run_request_uuid'),
				projectUrl: this.getProjectUrl(),
				packageUrl: this.getPackageUrl(),
				packageVersionUrl: this.getPackageVersionUrl(),
				toolUrl: this.getToolUrl(),
				toolVersionUrl: this.getToolVersionUrl(),
				platformUrl: this.getPlatformUrl(),
				platformVersionUrl: this.getPlatformVersionUrl(),

				// options
				//
				showProjects: this.options.showProjects,
				showSchedule: this.options.showSchedule,
				showDelete: this.options.showDelete
			};
		},

		onRender: function() {

			// show tooltips
			//
			this.$el.find("[data-toggle='tooltip']").tooltip({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Scheduled Run",
				message: "Are you sure that you want to delete this " + this.model.get('run_request').get('name') + " scheduled run of " + this.model.get('package_name') + " using " + this.model.get('tool_name') + " on " + this.model.get('platform_name') + "?",

				// callbacks
				//
				accept: function() {
					var runRequest = new RunRequest({
						'run_request_uuid': self.model.get('run_request').get('run_request_uuid')
					});
					var assessmentRun = new AssessmentRun({
						'assessment_run_uuid': self.model.get('assessment_run_uuid')
					});

					runRequest.deleteRunRequest(assessmentRun, {

						// callbacks
						//
						success: function() {

							// remove item from collection
							//
							self.collection.remove(self.model);

							// perform callback
							//
							if (self.options.onDelete) {
								self.options.onDelete();
							}
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this assessment run request."
							});
						}
					});
				}
			});
		}
	});
});