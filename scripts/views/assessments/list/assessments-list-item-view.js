/******************************************************************************\
|                                                                              |
|                        assessments-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single assessment item.             |
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
	'bootstrap/popover',
	'text!templates/assessments/list/assessments-list-item.tpl',
	'models/assessments/assessment-run',
	'models/packages/package',
	'models/packages/package-version',
	'models/tools/tool',
	'models/tools/tool-version',
	'models/platforms/platform',
	'models/platforms/platform-version',
	'views/collections/tables/table-list-item-view'
], function($, _, Popover, Template, AssessmentRun, Package, PackageVersion, Tool, ToolVersion, Platform, PlatformVersion, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .results .badge-group': 'onClickResults',
			'click .delete button': 'onClickDelete'
		},

		//
		// querying methods
		//

		getQueryString: function() {
			var data = {};

			data.project = this.model.get('project_uuid');

			if (this.model.has('package_version_uuid')) {
				data['package-version'] = this.model.get('package_version_uuid');
			} else if (this.model.has('package_uuid')) {
				data.package = this.model.get('package_uuid');
			}

			if (this.model.get('tool_version_uuid')) {
				data['tool-version'] = this.model.get('tool_version_uuid');
			} else if (this.model.get('tool_uuid')) {
				data.tool = this.model.get('tool_uuid');
			}

			if (this.model.get('platform_version_uuid')) {
				data['platform-version'] = this.model.get('platform_version_uuid');
			} else if (this.model.get('platform_uuid')) {
				data.platform = this.model.get('platform_uuid');
			}

			return toQueryString(data);
		},

		getProjectUrl: function() {
			if (this.model.has('project_uuid') && this.model.get('project_uuid') != 'undefined') {
				return application.getURL() + '#projects/' + this.model.get('project_uuid');
			}
		},

		getPackageUrl: function() {
			if (this.model.has('package_uuid') && this.model.get('package_uuid') != 'undefined') {
				return application.getURL() + '#packages/' + this.model.get('package_uuid');	
			}
		},

		getPackageVersionUrl: function() {
			if (this.model.get('package_version_uuid') && this.model.get('package_version_uuid') != 'undefined') {
				return application.getURL() + '#packages/versions/' + this.model.get('package_version_uuid');
			}
		},

		getToolUrl: function() {
			if (this.model.get('tool_uuid') && this.model.get('tool_uuid') != 'undefined') {
				return application.getURL() + '#tools/' + this.model.get('tool_uuid');
			}
		},

		getToolVersionUrl: function() {
			if (this.model.get('tool_version_uuid') && this.model.get('tool_version_uuid') != 'undefined') {
				return application.getURL() + '#tools/versions/' + this.model.get('tool_version_uuid');
			}
		},

		getPlatformUrl: function() {
			if (this.model.get('platform_uuid') && this.model.get('platform_uuid') != 'undefined') {
				return application.getURL() + '#platforms/' + this.model.get('platform_uuid');
			}
		},

		getPlatformVersionUrl: function(data) {
			if (this.model.get('platform_version_uuid') && this.model.get('platform_version_uuid') != 'undefined') {
				return application.getURL() + '#platforms/versions/' + this.model.get('platform_version_uuid');
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {

				// urls
				//
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
				showDelete: this.options.showDelete
			};
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="tooltip"]').popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickResults: function(event) {

			// append query string to results link
			//
			this.$el.find('a').attr('href', '#results?' + this.getQueryString());
		},
		
		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Assessment",
				message: "Are you sure that you want to delete this assessment of " + this.model.get('package_name') + " using " + this.model.get('tool_name') + " on " + this.model.get('platform_name') + "?",

				// callbacks
				//
				accept: function() {
					var assessmentRun = new AssessmentRun();
					self.model.url = assessmentRun.url;

					// delete model from database
					//
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
		}
	});
});