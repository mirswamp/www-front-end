/******************************************************************************\
|                                                                              |
|                                tool-filter-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a tool filter.                      |
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
	'collapse',
	'modernizr',
	'text!templates/tools/filters/tool-filter.tpl',
	'views/tools/selectors/tool-filter-selector-view'
], function($, _, Backbone, Marionette, Collapse, Modernizr, Template, ToolFilterSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			toolFilterSelector: '.name-selector',
			toolVersionFilterSelector: '.version-filter-selector'
		},

		events: {
			'click #reset': 'onClickReset'
		},

		maxTagLength: 40,

		//
		// methods
		//

		initialize: function() {
			if (this.options.initialSelectedTool) {
				this.selected = this.options.initialSelectedTool;
			}
			if (this.options.initialSelectedToolVersion) {
				this.selectedVersion = this.options.initialSelectedToolVersion;
			}
		},

		//
		// setting methods
		//

		setPackage: function(package, options) {
			this.toolFilterSelector.currentView.setPackage(package, options);
		},

		reset: function(options) {

			// reset attributes
			//
			this.selected = undefined;
			this.selectedVersion = undefined;

			// reset selector
			//
			this.toolFilterSelector.currentView.reset({
				silent: true
			});

			this.onChange(options);
		},

		update: function(options) {
			this.toolFilterSelector.currentView.update({
				silent: true
			});
			this.onChange(options);
		},

		//
		// querying methods
		//

		hasSelected: function() {
			return this.toolFilterSelector.currentView.hasSelected();
		},

		getSelected: function() {
			return this.selected;
		},

		getSelectedVersion: function() {
			return this.selectedVersion;
		},

		getDescription: function() {
			return this.toolFilterSelector.currentView.getDescription();
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#tool-filter">' + 
				'<i class="fa fa-wrench"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription().truncatedTo(this.maxTagLength));
		},

		getData: function() {
			var data = {};
			var tool = this.getSelected();
			var toolVersion = this.getSelectedVersion();

			// add tool data
			//
			if (tool && tool != 'any') {
				data['tool'] = tool;
			}

			// add tool version data
			//
			if (toolVersion && toolVersion != 'any') {
				data['tool-version'] = toolVersion;
			}
			
			return data;
		},

		getAttrs: function() {
			var attrs = {};
			var tool = this.getSelected();
			var toolVersion = this.getSelectedVersion();

			// add tool uuid
			//
			if (tool && (!toolVersion || typeof toolVersion == 'string')) {
				attrs.tool_uuid = tool.get('tool_uuid');
			}

			// add tool version uuid
			//
			if (toolVersion && toolVersion != 'any') {
				if (toolVersion == 'latest') {
					attrs.tool_version_uuid = toolVersion;
				} else {
					attrs.tool_version_uuid = toolVersion.get('tool_version_uuid');
				}
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';
			var tool = this.getSelected();
			var toolVersion = this.getSelectedVersion();

			// add tool uuid
			//
			if (tool && (!toolVersion || typeof toolVersion == 'string')) {
				queryString = addQueryString(queryString, 'tool=' + tool.get('tool_uuid'));
			}

			// add tool version uuid
			//
			if (toolVersion && toolVersion != 'any') {
				if (typeof toolVersion == 'string') {
					queryString = addQueryString(queryString, 'tool-version=' + toolVersion);
				} else {
					queryString = addQueryString(queryString, 'tool-version=' + toolVersion.get('tool_version_uuid'));
				}
			}

			return queryString;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			var self = this;

			// show sub views
			//
			this.toolFilterSelector.show(
				new ToolFilterSelectorView([], {
					project: this.model,
					initialValue: this.options.initialSelectedTool,
					initialVersion: this.options.initialSelectedToolVersion,
					versionFilterSelector: this.toolVersionFilterSelector,
					versionFilterLabel: this.$el.find('.version label'),
					versionDefaultOptions: this.options.versionDefaultOptions,
					versionSelectedOptions: this.options.versionSelectedOptions,
					packageSelected: this.options.packageSelected,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);

			// update reset button
			//
			this.updateReset();
		},

		//
		// reset button related methods
		//

		showReset: function() {
			this.$el.find('#reset').show();
		},

		hideReset: function() {
			this.$el.find('#reset').hide();
		},

		updateReset: function() {
			if (this.hasSelected()) {
				this.showReset();
			} else {
				this.hideReset();
			}
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update tool
			//
			this.selected = this.toolFilterSelector.currentView.getSelected();

			// update tool version
			//
			this.selectedVersion = this.toolVersionFilterSelector.currentView?
				this.toolVersionFilterSelector.currentView.getSelected() : undefined;

			// update reset button
			//
			this.updateReset();

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					tool: this.selected, 
					toolVersion: this.selectedVersion
				});
			}
		},

		onClickReset: function() {
			this.reset();
		}
	});
});