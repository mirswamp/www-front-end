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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
	'text!templates/assessment-results/assessment-runs/select-list/select-assessment-runs-list-item.tpl',
	'config',
	'registry',
	'models/tools/tool',
	'views/assessment-results/assessment-runs/list/assessment-runs-list-item-view',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Popover, Template, Config, Registry, Tool, AssessmentRunsListItemView) {
	return AssessmentRunsListItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: _.extend(AssessmentRunsListItemView.prototype.events, {
			'click .select input': 'onClickSelectInput',
			'click .select-group input': 'onClickSelectGroupInput',
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

		getErrorUrl: function() {
			if (this.model.has('assessment_result_uuid') && this.model.has('project_uuid')) {
				var assessmentResultUuid = this.model.get('assessment_result_uuid');
				var viewer = this.options.errorViewer;
				var projectUuid = this.model.get('project_uuid');
				return Registry.application.getURL() + '#results/' + assessmentResultUuid + '/viewer/' + viewer.get('viewer_uuid') + '/project/' + projectUuid;
			}
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
				errorUrl: this.options.showErrors? this.getErrorUrl() : undefined,
				isChecked: this.options.selected? this.options.selected.contains(this.model) : false,
				showSelect: this.options.editable || this.isViewable(),
				isSelectable: this.isSelectable(),
				showNumbering: this.options.showNumbering,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.model.isVmReady() && Registry.application.session.user.hasSshAccess() && this.options.showSsh
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
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
