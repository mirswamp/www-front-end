/******************************************************************************\
|                                                                              |
|                        assessment-runs-list-item-view.js                     |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'text!templates/results/assessment-runs/list/assessment-runs-list-item.tpl',
	'models/run-requests/run-request',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Config, Template, RunRequest, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .ssh': 'onClickSsh',
			'click .delete button': 'onClickDelete'
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
			var url = application.getURL() + '#results/' + this.model.get('assessment_result_uuid') + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + this.model.get('project_uuid');
			var target = '_blank';
			var replace = false;

			// open new popup window
			//
			var resultsWindow = window.open(url, target, options, replace);
		},

		showSshInfo: function(sshInfo) {
			require([
				'views/results/assessment-runs/list/dialogs/ssh-info-dialog-view'
			], function (SshInfoDialogView) {

				// show ssh dialog
				//
				application.show(new SshInfoDialogView({
					sshInfo: sshInfo
				}));
			});
		},

		//
		// querying methods
		//

		isViewable: function() {
			return !this.model.hasErrors() && this.model.hasResults() && this.model.hasWeaknesses();
		},

		getRunUrl: function() {
			if (this.model.has('execution_record_uuid')) {
				return application.getURL() + 
					'#runs/' + this.model.get('execution_record_uuid') + 
					'/status' + (this.options.queryString != ''? '?' + this.options.queryString : '');
			}
		},

		getProjectUrl: function() {
			if (this.model.has('project') && this.model.get('project').project_uuid) {
				return application.getURL() + 
					'#projects/' + this.model.get('project').project_uuid;
			}
		},

		getPackageUrl: function() {
			if (this.model.has('package') && this.model.get('package').package_uuid) {
				return application.getURL() + 
					'#packages/' + this.model.get('package').package_uuid;
			}
		},

		getPackageVersionUrl: function() {
			if (this.model.has('package') && this.model.get('package').package_version_uuid) {
				return application.getURL() + 
					'#packages/versions/' + this.model.get('package').package_version_uuid;
			}
		},

		getToolUrl: function() {
			if (this.model.has('tool') && this.model.get('tool').tool_uuid) {
				return application.getURL() + 
				'#tools/' + this.model.get('tool').tool_uuid;
			}
		},

		getToolVersionUrl: function() {
			if (this.model.has('tool') && this.model.get('tool').tool_version_uuid) {
				return application.getURL() + 
					'#tools/versions/' + this.model.get('tool').tool_version_uuid;
			}
		},

		getPlatformUrl: function() {
			if (this.model.has('platform') && this.model.get('platform').platform_uuid) {
				return application.getURL() + 
					'#platforms/' + this.model.get('platform').platform_uuid;
			}
		},

		getPlatformVersionUrl: function(data) {
			if (this.model.has('platform') && this.model.get('platform').platform_version_uuid) {
				return application.getURL() + 
					'#platforms/versions/' + this.model.get('platform').platform_version_uuid;
			}
		},

		getWarningsUrl: function() {
			if (this.model.has('assessment_result_uuid') && this.model.has('project_uuid') && this.options.errorViewer) {
				return application.getURL() + 
					'#results/' + this.model.get('assessment_result_uuid') + 
					'/viewer/' + this.options.errorViewer.get('viewer_uuid') + 
					'/project/' + this.model.get('project_uuid') + '?type=warnings';
			}
		},

		getErrorsUrl: function() {
			if (this.model.has('assessment_result_uuid') && this.model.has('project_uuid') && this.options.errorViewer) {
				return application.getURL() + 
					'#results/' + this.model.get('assessment_result_uuid') + 
					'/viewer/' + this.options.errorViewer.get('viewer_uuid') + 
					'/project/' + this.model.get('project_uuid') + '?type=errors';
			}
		},

		getResultsUrl: function() {
			if (this.model.has('assessment_result_uuid')) {
				return Config.servers.web + '/v1/assessment_results/' + this.model.get('assessment_result_uuid') + '/scarf';
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isComplete: this.model.isComplete(),
				hasResults: this.model.hasResults(),
				hasWarnings: this.model.hasWarnings(),
				hasErrors: this.model.hasErrors(),

				// urls
				//
				runUrl: this.getRunUrl(),
				projectUrl: this.getProjectUrl(),
				packageUrl: this.getPackageUrl(),
				packageVersionUrl: this.getPackageVersionUrl(),
				toolUrl: this.getToolUrl(),
				toolVersionUrl: this.getToolVersionUrl(),
				platformUrl: this.getPlatformUrl(),
				platformVersionUrl: this.getPlatformVersionUrl(),
				resultsUrl: this.getResultsUrl(),
				warningsUrl: this.getWarningsUrl(),
				errorsUrl: this.options.showErrors? this.getErrorsUrl() : undefined,
	
				// options
				//			
				showProjects: this.options.showProjects,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh,
				sshEnabled: this.model.isVmReady() && application.session.user.hasSshAccess()
			};
		},

		onRender: function() {

			// show tooltips on hover
			//
			this.$el.find("[data-toggle='tooltip']").popover({
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

							// show error message
							//
							application.error({
								message: "Could not delete this assessment."
							});
						}
					});
				}
			});
		},

		onClickErrors: function() {
			this.showViewer(this.options.viewers.getNative());
		},

		onClickSsh: function() {
			var self = this;
			this.model.getSshAccess({

				// callbacks
				//
				success: function(response){

					// show ssh info
					//
					self.showSshInfo(response);
				},

				error: function(response){
					
					// show notification
					//
					application.notify({
						message: response.responseText
					});
				}
			});
		}
	});
});
