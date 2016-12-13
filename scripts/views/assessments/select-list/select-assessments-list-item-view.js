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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tooltip',
	'text!templates/assessments/select-list/select-assessments-list-item.tpl',
	'registry',
	'utilities/browser/query-strings',
	'views/assessments/list/assessments-list-item-view'
], function($, _, Backbone, Marionette, Tooltip, Template, Registry, QueryStrings, AssessmentsListItemView) {
	return AssessmentsListItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: _.extend(AssessmentsListItemView.prototype.events, {
			'click .select input': 'onClickSelectInput',
			// 'dblclick .select input': 'onDoubleClickSelectInput',
			'click .select-group input': 'onClickSelectGroupInput'
		}),

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				index: this.options.index + 1,
				showNumbering: this.options.showNumbering,
				packageUrl: data.package_uuid && data.package_uuid != 'undefined'? Registry.application.getURL() + '#packages/' + data.package_uuid : undefined,
				packageVersionUrl: data.package_version_uuid && data.package_version_uuid != 'undefined'? Registry.application.getURL() + '#packages/versions/' + data.package_version_uuid : undefined,
				toolUrl: data.tool_uuid && data.tool_uuid != 'undefined'? Registry.application.getURL() + '#tools/' + data.tool_uuid : undefined,
				toolVersionUrl: data.tool_version_uuid && data.tool_version_uuid != 'undefined'? Registry.application.getURL() + '#tools/versions/' + data.tool_version_uuid : undefined,
				platformUrl: data.platform_uuid && data.platform_uuid != 'undefined'? Registry.application.getURL() + '#platforms/' + data.platform_uuid : undefined,
				platformVersionUrl: data.platform_version_uuid && data.platform_version_uuid != 'undefined'? Registry.application.getURL() + '#platforms/versions/' + data.platform_version_uuid : undefined,
				showDelete: this.options.showDelete
			}));
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