/******************************************************************************\
|                                                                              |
|                              platform-filter-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a platform filter.                  |
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
	'bootstrap/collapse',
	'modernizr',
	'text!templates/platforms/filters/platform-filter.tpl',
	'views/platforms/selectors/platform-filter-selector-view'
], function($, _, Backbone, Marionette, Collapse, Modernizr, Template, PlatformFilterSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			platformFilterSelector: '.name-selector',
			platformVersionFilterSelector: '.version-filter-selector'
		},

		events: {
			'click #reset': 'onClickReset'
		},

		maxTagLength: 40,

		//
		// methods
		//

		initialize: function() {
			if (this.options.initialSelectedPlatform) {
				this.selected = this.options.initialSelectedPlatform;
			}
			if (this.options.initialSelectedPlatformVersion) {
				this.selectedVersion = this.options.initialSelectedPlatformVersion;
			}
		},

		//
		// setting methods
		//

		setTool: function(tool, options) {
			this.platformFilterSelector.currentView.setTool(tool, options);
		},

		reset: function(options) {

			// reset attributes
			//
			this.selected = undefined;
			this.selectedVersion = undefined;

			// reset selector
			//
			this.platformFilterSelector.currentView.reset({
				silent: true
			});

			this.onChange(options);
		},

		update: function(options) {
			this.platformFilterSelector.currentView.update({
				silent: true
			});
			this.onChange(options);
		},

		//
		// querying methods
		//

		hasSelected: function() {
			return this.platformFilterSelector.currentView.hasSelected();
		},

		getSelected: function() {
			return this.selected;
		},

		getSelectedVersion: function() {
			return this.selectedVersion;
		},

		getDescription: function() {
			return  this.platformFilterSelector.currentView.getDescription();
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#platform-filter">' + 
				'<i class="fa fa-bars"></i>' + text + '</span>';
		},

		getTag: function() {
			var description = this.getDescription();
			return this.tagify(description? description.truncatedTo(this.maxTagLength) : '?');
		},

		getData: function() {
			var data = {};
			var platform = this.getSelected();
			var platformVersion = this.getSelectedVersion();

			// add platform data
			//
			if (platform && platform != 'any') {
				data['platform'] = platform;
			}

			// add platform version data
			//
			if (platformVersion && platformVersion != 'any') {
				data['platform-version'] = platformVersion;
			}
			
			return data;
		},

		getAttrs: function() {
			var attrs = {};
			var platform = this.getSelected();
			var platformVersion = this.getSelectedVersion();

			// add platform uuid
			//
			if (platform && (!platformVersion || typeof platformVersion == 'string')) {
				attrs.platform_uuid = platform.get('platform_uuid');
			}

			// add platform version uuid
			//
			if (platformVersion && platformVersion != 'any') {
				if (platformVersion == 'latest') {
					attrs.platform_version_uuid = platformVersion;
				} else {
					attrs.platform_version_uuid = platformVersion.get('platform_version_uuid');
				}
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';
			var platform = this.getSelected();
			var platformVersion = this.getSelectedVersion();

			// add platform uuid
			//
			if (platform && (!platformVersion || typeof platformVersion == 'string')) {
				queryString = addQueryString(queryString, 'platform=' + platform.get('platform_uuid'));
			}

			// add platform version uuid
			//
			if (platformVersion && platformVersion != 'any') {
				if (typeof platformVersion == 'string') {
					queryString = addQueryString(queryString, 'platform-version=' + platformVersion);
				} else {
					queryString = addQueryString(queryString, 'platform-version=' + platformVersion.get('platform_version_uuid'));
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
			this.platformFilterSelector.show(
				new PlatformFilterSelectorView([], {
					project: this.model,
					initialValue: this.options.initialSelectedPlatform,
					initialVersion: this.options.initialSelectedPlatformVersion,
					versionFilterSelector: this.platformVersionFilterSelector,
					versionFilterLabel: this.$el.find('.version label'),
					versionDefaultOptions: this.options.versionDefaultOptions,
					versionSelectedOptions: this.options.versionSelectedOptions,
					toolSelected: this.options.toolSelected,

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

			// update platform
			//
			this.selected = this.platformFilterSelector.currentView.getSelected();

			// update platform version
			//
			this.selectedVersion = this.platformVersionFilterSelector.currentView?
				this.platformVersionFilterSelector.currentView.getSelected() : undefined;

			// update reset button
			//
			this.updateReset();

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					platform: this.selected, 
					platformVersion: this.selectedVersion
				});
			}
		},

		onClickReset: function() {
			this.reset();
		}
	});
});