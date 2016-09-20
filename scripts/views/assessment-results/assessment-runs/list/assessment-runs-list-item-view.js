/******************************************************************************\
|                                                                              |
|                          assessment-runs-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single run request list item.       |
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
	'tooltip',
	'popover',
	'text!templates/assessment-results/assessment-runs/list/assessment-runs-list-item.tpl',
	'config',
	'registry',
	'models/run-requests/run-request',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, Config, Registry, RunRequest, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			//'click #errors': 'onClickErrors',
			'click button.delete': 'onClickDelete',
			'click button.ssh': 'onClickSshButton'
		},

		//
		// methods
		//

		showViewer: function(viewer) {
			var self = this;

			// check viewer permissions
			//
			viewer.checkPermission(this.model.get('assessment_result_uuid'), self.model.get('project_uid'), {

				// callbacks
				//
				success: function(){
					self.showResults(viewer);
				},

				error: function(response){
					var runRequest = new RunRequest({});
					runRequest.handleError(response);
				}
			});
		},

		showResults: function(viewer) {

			// clear popovers
			//
			$(".popover").remove();

			// show results using the native viewer
			//
			var options = 'scrollbars=yes,directories=yes,titlebar=yes,toolbar=yes,location=yes';
			var url = Registry.application.getURL() + '#results/' + this.model.get('assessment_result_uuid') + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + this.model.get('project_uuid');
			var target = '_blank';
			var replace = false;

			// open new popup window
			//
			var resultsWindow = window.open(url, target, options, replace);
		},

		showSshInfo: function(sshInfo) {
			require([
				'registry',
				'views/assessment-results/assessment-runs/list/dialogs/ssh-info-view'
			], function (Registry, SshInfoView) {

				// show report incident view
				//
				Registry.application.modal.show(
					new SshInfoView({
						sshInfo: sshInfo
					})
				);
			});
		},

		//
		// querying methods
		//

		isSelected: function() {
			return this.$el.find('input').is(':checked');
		},

		getErrorUrl: function() {
			var assessmentResultUuid = this.model.get('assessment_result_uuid');
			var viewer = this.options.errorViewer;
			var projectUuid = this.model.get('project_uuid');
			return Registry.application.getURL() + '#results/' + assessmentResultUuid + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + projectUuid;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				index: this.options.index + 1,
				runUrl: Registry.application.getURL() + '#runs/' + this.model.get('execution_record_uuid') + '/status' + (this.options.queryString != ''? '?' + this.options.queryString : ''),
				packageUrl: data.package.package_uuid? Registry.application.getURL() + '#packages/' + data.package.package_uuid : undefined,
				packageVersionUrl:  data.package.package_version_uuid? Registry.application.getURL() + '#packages/versions/' + data.package.package_version_uuid : undefined,
				toolUrl: data.tool.tool_uuid? Registry.application.getURL() + '#tools/' + data.tool.tool_uuid : undefined,
				toolVersionUrl: data.tool.tool_version_uuid? Registry.application.getURL() + '#tools/versions/' + data.tool.tool_version_uuid : undefined,
				platformUrl: data.platform.platform_uuid? Registry.application.getURL() + '#platforms/' + data.platform.platform_uuid : undefined,
				platformVersionUrl: data.platform.platform_version_uuid? Registry.application.getURL() + '#platforms/versions/' + data.platform.platform_version_uuid : undefined,
				viewer: this.options.viewer,
				errorUrl: this.options.showErrors? this.getErrorUrl() : undefined,
				showNumbering: this.options.showNumbering,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.model.isVmReady() && Registry.application.session.user.hasSshAccess() && this.options.showSsh
			}));
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
					title: "Delete Assessment Results",
					message: "Are you sure that you want to delete these assessment results? " +
						"When you delete assessment results, all of the results data will continue to be retained.",

					// callbacks
					//
					accept: function() {
						self.model.destroy({

							// callbacks
							//
							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this assessment."
									})
								);
							}
						});
					}
				})
			);
		},

		onClickErrors: function() {
			this.showViewer(this.options.viewers.getNative());
		},

		onClickSshButton: function() {
			var self = this;
			this.model.getSshAccess({

				// callbacks
				//
				success: function(response){

					// show ssh info dialog
					//
					self.showSshInfo(response);
				},

				error: function(response){
					
					// show notify dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							message: response.responseText
						})
					);
				}
			});
		}
	});
});
