/******************************************************************************\
|                                                                              |
|                      select-assessment-runs-list-item-view.js                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single selectable run request       |
|        list item.                                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/tooltip',
	'text!templates/results/assessment-runs/select-list/select-assessment-runs-list-item.tpl',
	'config',
	'registry',
	'models/packages/package',
	'models/tools/tool',
	'views/results/assessment-runs/list/assessment-runs-list-item-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Tooltip, Template, Config, Registry, Package, Tool, AssessmentRunsListItemView) {
	return AssessmentRunsListItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: _.extend(AssessmentRunsListItemView.prototype.events, {
			'click .select input': 'onClickSelectInput',
			'click .select-group input': 'onClickSelectGroupInput',
			'click .scarf-results': 'onClickScarfResults'
			// 'dblclick .select input': 'onDoubleClickSelectInput'
		}),

		//
		// selection methods
		//

		isSelected: function() {
			return this.$el.find('input[name="select"]').is(':checked');
		},

		setSelected: function(selected) {
			if (selected) {
				this.$el.find('input[name="select"]').attr('checked', 'checked');
			} else {
				this.$el.find('input[name="select"]').removeAttr('checked');
			}
		},

		//
		// querying methods
		//

		isSelectable: function() {
			return Tool.prototype.isCompatibleWith.call(this.model.attributes.tool, this.options.viewer);
		},

		isViewable: function() {
			return !this.model.hasErrors() && this.model.hasResults() && this.model.hasWeaknesses();
		},

		getRunUrl: function(data) {
			return Registry.application.getURL() + '#runs/' + data.execution_record_uuid + '/status' + (this.options.queryString != ''? '?' + this.options.queryString : '');
		},

		getProjectUrl: function(data) {
			if (data.project.project_uuid) {
				return Registry.application.getURL() + '#projects/' + data.project.project_uuid;
			}
		},

		getPackageUrl: function(data) {
			if (data.package.package_uuid) {
				return Registry.application.getURL() + '#packages/' + data.package.package_uuid;
			}
		},

		getPackageVersionUrl: function(data) {
			if (data.package.package_version_uuid) {
				return Registry.application.getURL() + '#packages/versions/' + data.package.package_version_uuid;
			}
		},

		getToolUrl: function(data) {
			if (data.tool.tool_uuid) {
				return Registry.application.getURL() + '#tools/' + data.tool.tool_uuid;
			}
		},

		getToolVersionUrl: function(data) {
			if (data.tool.tool_version_uuid) {
				return Registry.application.getURL() + '#tools/versions/' + data.tool.tool_version_uuid;
			}
		},

		getPlatformUrl: function(data) {
			if (data.platform.platform_uuid) {
				return Registry.application.getURL() + '#platforms/' + data.platform.platform_uuid;
			}
		},

		getPlatformVersionUrl: function(data) {
			if (data.platform.platform_version_uuid) {
				return Registry.application.getURL() + '#platforms/versions/' + data.platform.platform_version_uuid;
			}
		},

		getErrorUrl: function() {
			if (this.model.has('assessment_result_uuid') && this.model.has('project_uuid')) {
				var assessmentResultUuid = this.model.get('assessment_result_uuid');
				var viewer = this.options.errorViewer;
				var projectUuid = this.model.get('project_uuid');
				return Registry.application.getURL() + '#results/' + assessmentResultUuid + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + projectUuid;
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				index: this.options.index + 1,
				runUrl: this.getRunUrl(data),
				projectUrl: this.getProjectUrl(data),
				packageUrl: this.getPackageUrl(data),
				packageVersionUrl: this.getPackageVersionUrl(data),
				toolUrl: this.getToolUrl(data),
				toolVersionUrl: this.getToolVersionUrl(data),
				platformUrl: this.getPlatformUrl(data),
				platformVersionUrl: this.getPlatformVersionUrl(data),
				resultsUrl: this.getResultsUrl(),
				errorUrl: this.options.showErrors? this.getErrorUrl() : undefined,
				isChecked: this.options.selected? this.options.selected.contains(this.model) : false,
				showSelect: this.options.editable || this.isViewable(),
				isSelectable: this.isSelectable(),
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh,
				sshEnabled: this.model.isVmReady() && Registry.application.session.user.hasSshAccess()
			}));
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

		onClickSelectInput: function(event) {
			var index = this.options.parent.getSelectedElementIndex(event.target);
			var checked = $(event.target).prop('checked');

			// save index for shift clicking
			//
			var previousIndex = this.options.parent.clickedIndex;
			this.options.parent.clickedIndex = index;

			// check for shift clicking
			//
			if (this.options.parent.shiftClicking && previousIndex != undefined) {

				// select / deselect range
				//
				this.options.parent.setSelectedRange(previousIndex, index, checked);

				// end shift clicking
				//
				this.options.parent.shiftClicking = false;
			}

			// update parent view
			//
			/*
			var self = this;
			this.timeout = window.setTimeout(function() {
				self.options.parent.onSelect();
			}, 500);
			*/
			this.options.parent.onSelect();
		},

		onClickSelectGroupInput: function(event) {
			var index = this.options.parent.getSelectedGroupElementIndex(event.target);
			var checked = $(event.target).prop('checked');
			this.options.parent.setSelectedContiguous(index, checked);
			this.options.parent.onSelect();
		},

		onClickScarfResults: function(event) {
			var self = this;
			var tool = new Tool(this.model.get('tool'));
			var package = new Package(this.model.get('package'));

			if (tool.isRestricted() && tool.get('permission') != 'granted') {

				// cancel event
				//
				event.stopPropagation();
				event.preventDefault();

				// ensure the user has permission and has accepted any pertinent EULAs
				//
				tool.confirmPolicy({

					// callbacks
					//
					success: function() {

						// update tool permission
						//
						var tool = self.model.get('tool');
						tool.permission = 'granted';
						self.model.set({
							tool: tool
						});
					}
				});
			}
		}

		/*
		onDoubleClickInput: function(event) {
			var index = this.options.parent.getSelectedElementIndex(event.target);
			var checked = !$(event.target).prop('checked');
			this.options.parent.setSelectedContiguous(index, checked);
			window.clearTimeout(this.timeout);
		}
		*/
	});
});
