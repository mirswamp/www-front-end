/******************************************************************************\
|                                                                              |
|                          platform-filter-selector-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a platform filter from a list.      |
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
	'select2',
	'text!templates/widgets/selectors/grouped-name-selector.tpl',
	'registry',
	'collections/platforms/platforms',
	'collections/platforms/platform-versions',
	'views/dialogs/error-view',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Backbone, Select2, Template, Registry, Platforms, PlatformVersions, ErrorView, GroupedNameSelectorView, VersionFilterSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// constructor
		//

		initialize: function(attributes, options) {

			// call superclass method
			//
			GroupedNameSelectorView.prototype.initialize.call(this, options);

			// set attributes
			//
			this.collection = new Backbone.Collection();
			this.options = options;

			// fetch and display
			//
			this.update();
		},

		//
		// setting methods
		//

		setTool: function(tool, options) {

			// set attributes
			//
			this.options.toolSelected = tool;

			// reset selection
			//
			this.reset(_.extend(options || {}, {
				update: true
			}));
		},

		reset: function(options) {
			if (options.update) {
				var self = this;
				this.update({
					done: function() {

						// reset selection
						//
						self.setSelectedName('Any', options);
					}
				})
			} else {

				// reset selection
				//
				this.setSelectedName('Any', options);
			}
		},

		update: function(options) {
			var self = this;

			// fetch platforms
			//
			this.fetchPlatforms(function(publicPlatforms) {
				self.collection = new Backbone.Collection([{
					'name': "Any",
					'model': null
				}, {
					'name': "Public Platforms",
					'group': publicPlatforms || new Platforms()
				}]);
				
				// render
				//
				self.render();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}

				// show version filter selector
				//
				if (self.options.versionFilterSelector) {
					self.showVersionFilter(self.options.versionFilterSelector);
				}
			});
		},

		//
		// ajax methods
		//

		fetchPlatforms: function(success) {
			var self = this;
			var publicPlatforms = new Platforms([]);

			// fetch all platforms
			//
			publicPlatforms.fetchPublic({

				// callbacks
				//
				success: function() {
					success(publicPlatforms);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch all platforms."
						})
					);
				}
			});
		},

		//
		// name querying methods
		//

		getSelectedName: function() {
			if (this.hasSelected()) {
				return this.getSelected().get('name');
			} else {
				return "any platform";
			}
		},

		hasSelectedName: function() {
			return (this.getSelected() !== null) && (this.getSelected() != undefined);
		},

		//
		// version querying methods
		//

		hasSelectedVersion: function() {
			if (this.options.versionFilterSelector && this.options.versionFilterSelector.currentView) {
				return this.options.versionFilterSelector.currentView.hasSelected();
			} else if (this.options.initialVersion) {
				return true;
			} else {
				return false;
			}
		},

		hasSelectedVersionString: function() {
			return this.getSelectedVersionString() != undefined;
		},

		getSelectedVersionString: function() {
			if (this.options.versionFilterSelector && this.options.versionFilterSelector.currentView) {
				return this.options.versionFilterSelector.currentView.getSelectedVersionString();
			} else if (this.options.initialVersion) {
				return VersionFilterSelectorView.getVersionString(this.options.initialVersion);
			}
		},

		//
		// name and version querying methods
		//

		getDescription: function() {
			if (this.hasSelectedName()) {

				// return name and version
				//
				var description =  this.getSelectedName();
				if (this.hasSelectedVersion()) {
					if (description) {
						description += " ";
					}
					description += this.getSelectedVersionString();
				}
				return description;
			} else {

				// return name only
				//
				return this.getSelectedName();
			}
		},

		//
		// tool enabling / disabling methods
		//

		getEnabled: function() {
			var self = this;
			var enabled = [];

			if (this.options.toolSelected) {
				var platformNames = this.options.toolSelected.get('platform_names');

				// generate list of enabled platforms
				//
				this.collection.each(function(item, index, list) {
					if (group = item.get('group')) {
						group.each(function(platform) {
							if (_.contains(platformNames, platform.get('name'))) {
								enabled.push(platform);
							}
						});
					}
				});
			} else {

				// return list of all platforms
				//
				this.collection.each(function(item, index, list) {
					if (group = item.get('group')) {
						group.each(function(platform) {
							enabled.push(platform);
						});
					}
				});
			}

			return enabled;
		},

		//
		// rendering methods
		//

		template: function(data) {
			this.enabledItems = this.getEnabled();
			
			// add enabled platforms
			//
			if (this.options.toolSelected) {
				var platformNames = this.options.toolSelected.get('platform_names');
				for (var i = 0; i < data.items.length; i++) {
					if (data.items[i].group) {
						var collection = new Backbone.Collection();
						var group = data.items[i].group;
						for (var j = 0; j < group.length; j++) {
							var item = data.items[i].group.at(j);
							if (_.contains(platformNames, item.get('name'))) {
								collection.add(item);
							}					
						}
						data.items[i].group = collection;
					}

				}
			}

			return _.template(Template, _.extend(data, {
				selected: this.options.initialValue
			}));
		},
		
		showVersionFilter: function(versionFilterSelector, done) {
			var self = this;
			var selectedPlatform = this.getSelected();
			
			if (selectedPlatform) {
				var collection = new PlatformVersions([]);

				// fetch platform versions
				//
				collection.fetchByPlatform(selectedPlatform, {

					// callbacks
					//
					success: function() {

						// show version filter selector view
						//
						versionFilterSelector.show(
							new VersionFilterSelectorView({
								collection: collection,
								initialValue: self.options.initialVersion,
								defaultOptions: self.options.versionDefaultOptions,
								selectedOptions: self.options.versionSelectedOptions,

								// callbacks
								//
								onChange: self.options.onChange
							})
						);

						// perform callback
						//
						if (done) {
							done();
						}
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch collection of platform versions."
							})
						);
					}
				});

				// show version filter label
				//
				if (this.options.versionFilterLabel) {
					this.options.versionFilterLabel.show();
				}
			} else {

				// hide version filter selector view
				//
				versionFilterSelector.reset();

				// hide version filter label
				//
				if (this.options.versionFilterLabel) {
					this.options.versionFilterLabel.hide();
				}

				// perform callback
				//
				if (done) {
					done();
				}
			}
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update selected
			//
			this.selected = this.enabledItems[this.getSelectedIndex() - 1];
			this.options.initialVersion = 'any';
			
			// update version selector
			//
			if (this.options.versionFilterSelector) {
				this.showVersionFilter(this.options.versionFilterSelector);
			}

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					'platform': this.selected
				});
			}
		}
	});
});
