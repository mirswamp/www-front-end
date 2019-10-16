/******************************************************************************\
|                                                                              |
|                        select-assessment-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single selectable assessment        |
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
	'text!templates/assessments/select-list/select-assessments-list-item.tpl',
	'utilities/web/query-strings',
	'views/assessments/list/assessments-list-item-view'
], function($, _, Template, QueryStrings, AssessmentsListItemView) {
	return AssessmentsListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: _.extend(AssessmentsListItemView.prototype.events, {
			'click .select input': 'onClickSelectInput',
			'click .select-group input': 'onClickSelectGroupInput'
		}),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				index: this.options.index + 1,
				showProjects: this.options.showProjects,
				showNumbering: this.options.showNumbering,
				projectUrl: this.getProjectUrl(),
				packageUrl: this.getPackageUrl(),
				packageVersionUrl: this.getPackageVersionUrl(),
				toolUrl: this.getToolUrl(),
				toolVersionUrl: this.getToolVersionUrl(),
				platformUrl: this.getPlatformUrl(),
				platformVersionUrl: this.getPlatformVersionUrl(),
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
			}

			this.options.parent.onSelect();
		},

		onClickSelectGroupInput: function(event) {
			var index = this.options.parent.getSelectedGroupElementIndex(event.target);
			var checked = $(event.target).prop('checked');
			this.options.parent.setSelectedContiguous(index, checked);
			
			this.options.parent.onSelect();
		},

		/*
		onDoubleClickSelectInput: function(event) {
			var index = this.options.parent.getSelectedElementIndex(event.target);
			var checked = !$(event.target).prop('checked');
			this.options.parent.setSelectedContiguous(index, checked);
		},
		*/
	});
});