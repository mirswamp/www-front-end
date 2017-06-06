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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tooltip',
	'popover',
	'text!templates/scheduled-runs/list/scheduled-runs-list-item.tpl',
	'registry',
	'models/packages/package',
	'models/packages/package-version',
	'models/tools/tool',
	'models/tools/tool-version',
	'models/platforms/platform',
	'models/platforms/platform-version',
	'models/assessments/assessment-run',
	'models/run-requests/run-request',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, Registry, Package, PackageVersion, Tool, ToolVersion, Platform, PlatformVersion, AssessmentRun, RunRequest, ConfirmView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			var runRequest = this.model.get('run_request');

			return _.template(Template, _.extend(data, {
				index: this.options.index + 1,
				runRequest: runRequest,
				runRequestUrl: '#run-requests/schedules/' + runRequest.get('run_request_uuid'),
				packageUrl: Registry.application.getURL() + '#packages/' + data.package_uuid,
				packageVersionUrl: data.package_version_uuid? Registry.application.getURL() + '#packages/versions/' + data.package_version_uuid : undefined,
				toolUrl: Registry.application.getURL() + '#tools/' + data.tool_uuid,
				toolVersionUrl: data.tool_version_uuid? Registry.application.getURL() + '#tools/versions/' + data.tool_version_uuid : undefined,
				platformUrl: Registry.application.getURL() + '#platforms/' + data.platform_uuid,
				platformVersionUrl: data.platform_version_uuid? Registry.application.getURL() + '#platforms/versions/' + data.platform_version_uuid : undefined,
				showNumbering: this.options.showNumbering,
				showSchedule: this.options.showSchedule,
				showDelete: this.options.showDelete
			}));
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

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
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

								// update parent view
								//
								self.options.parent.options.parent.options.parent.render();
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this assessment run request."
									})
								);
							}
						});
					}
				})
			);
		}
	});
});