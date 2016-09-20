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
	'popover',
	'text!templates/assessments/select-list/select-assessments-list-item.tpl',
	'registry',
	'utilities/query-strings',
	'views/assessments/list/assessments-list-item-view'
], function($, _, Backbone, Marionette, Popover, Template, Registry, QueryStrings, AssessmentsListItemView) {
	return AssessmentsListItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: _.extend(AssessmentsListItemView.prototype.events, {
			'click .select input': 'onClickSelectInput',
			// 'dblclick .select input': 'onDoubleClickSelectInput',
			'click .select-group input': 'onClickSelectGroupInput',
			'click .results button': 'onClickResultsButton'
		}),

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				index: this.options.index + 1,
				showNumbering: this.options.showNumbering,
				packageUrl: Registry.application.getURL() + '#packages/' + data.package_uuid,
				packageVersionUrl: data.package_version_uuid? Registry.application.getURL() + '#packages/versions/' + data.package_version_uuid : undefined,
				toolUrl: Registry.application.getURL() + '#tools/' + data.tool_uuid,
				toolVersionUrl: data.tool_version_uuid? Registry.application.getURL() + '#tools/versions/' + data.tool_version_uuid : undefined,
				platformUrl: Registry.application.getURL() + '#platforms/' + data.platform_uuid,
				platformVersionUrl: data.platform_version_uuid? Registry.application.getURL() + '#platforms/versions/' + data.platform_version_uuid : undefined,
				showDelete: this.options.showDelete
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

		getQueryString: function() {
			var data = {};

			data['project'] = this.model.get('project_uuid');

			if (this.model.get('package_version_uuid')) {
				data['package-version'] = this.model.get('package_version_uuid');
			} else {
				data['package'] = this.model.get('package_uuid');
			}

			if (this.model.get('tool_version_uuid')) {
				data['tool-version'] = this.model.get('tool_version_uuid');
			} else {
				data['tool'] = this.model.get('tool_uuid');
			}

			if (this.model.get('platform_version_uuid')) {
				data['platform-version'] = this.model.get('platform_version_uuid');
			} else {
				data['platform'] = this.model.get('platform_uuid');
			}

			return toQueryString(data);
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
		
		onClickResultsButton: function() {
			var queryString = this.getQueryString();

			// go to assessment results view
			//
			Backbone.history.navigate('#results' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
		}
	});
});