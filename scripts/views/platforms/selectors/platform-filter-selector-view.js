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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'select2',
	'collections/platforms/platforms',
	'collections/platforms/platform-versions',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Select2, Platforms, PlatformVersions, GroupedNameSelectorView, VersionFilterSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// constructor
		//

		initialize: function(options) {

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
				});
			} else {

				// reset selection
				//
				this.setSelectedName('Any', options);
			}
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

					// show error message
					//
					application.error({
						message: "Could not fetch all platforms."
					});
				}
			});
		},

		fetchPlatformVersions: function(platform, done) {
			var self = this;
			var collection = new PlatformVersions([]);

			// fetch platform versions
			//
			collection.fetchByPlatform(platform, {

				// callbacks
				//
				success: function() {

					// perform callback
					//
					if (done) {
						done(collection);
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch collection of platform versions."
					});
				}
			});
		},

		//
		// querying methods
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

		getEnabled: function(platforms) {

			// filter by tool
			//
			if (this.options.toolSelected) {
				platforms = platforms.getByTool(this.options.toolSelected);
			} 

			return platforms;
		},

		//
		// version querying methods
		//

		hasSelectedVersion: function() {
			if (this.versionFilterSelector) {
				return this.versionFilterSelector.hasSelected();
			} else {
				return false;
			}
		},

		hasSelectedVersionString: function() {
			return this.getSelectedVersionString() != undefined;
		},

		getSelectedVersionString: function() {
			if (this.versionFilterSelector) {
				return this.versionFilterSelector.getSelectedVersionString();
			} else if (this.options.initialVersion) {
				if (typeof this.options.initialVersion == 'string') {
					return this.options.initialVersion;
				} else {
					return this.options.initialVersion.get('version_string');
				}
			}
		},

		//
		// name and version querying methods
		//

		getDescription: function() {
			if (this.hasSelectedName()) {

				// return name and version
				//
				var description = this.getSelectedName();
				if (this.hasSelectedVersionString()) {
					var versionString = this.getSelectedVersionString();
					if (versionString && versionString != 'any version') {
						if (description) {
							description += " ";
						}
						description += versionString.replace('version', '').trim();
					}
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

		getPlatformNames: function(platforms) {
			var names = [];
			for (var i = 0; i < platforms.length; i++) {
				names.push(platforms[i].get('name'));
			}
			return names;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.options.initialValue
			};
		},
		
		update: function(options) {
			var self = this;

			// fetch platforms
			//
			this.fetchPlatforms(function(publicPlatforms) {

				// filter platforms
				//
				publicPlatforms = self.getEnabled(publicPlatforms);
				
				// set collection
				//
				self.collection = new Backbone.Collection([{
					name: 'Any',
					model: null
				}, {
					name: 'Public Platforms',
					group: publicPlatforms || new Platforms()
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
					self.updateVersionFilterSelector();
				}
			});
		},

		//
		// version filter rendering methods
		//

		showVersionFilterSelector: function(collection) {
			var self = this;

			// create new version filter selector
			//
			this.versionFilterSelector = new VersionFilterSelectorView({
				collection: collection,
				initialValue: this.options.initialVersion,
				defaultOptions: this.options.versionDefaultOptions,
				selectedOptions: this.options.versionSelectedOptions,
				searchable: true,

				// callbacks
				//
				onChange: function(changes) {

					// perform callback
					//
					if (self.options && self.options.onChange) {
						self.options.onChange({
							'platform-version': changes.version
						});
					}
				}
			});

			// show version filter selector
			//
			this.options.versionFilterSelector.show(self.versionFilterSelector);

			// show version filter label
			//
			if (this.options.versionFilterLabel) {
				this.options.versionFilterLabel.show();
			}
		},

		hideVersionFilterSelector: function() {

			// hide version filter selector view
			//
			this.options.versionFilterSelector.reset();

			// hide version filter label
			//
			if (this.options.versionFilterLabel) {
				this.options.versionFilterLabel.hide();
			}
		},

		updateVersionFilterSelector: function(done) {
			var self = this;
			if (this.options.versionFilterSelector) {
				if (this.selected) {
					this.fetchPlatformVersions(this.selected, function(collection) {
						self.showVersionFilterSelector(collection);

						// perform callback
						//
						if (done) {
							done();
						}
					});
				} else {
					this.hideVersionFilterSelector();

					// perform callback
					//
					if (done) {
						done();
					}
				}
			} else {

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
			var self = this;

			// update selected
			//
			this.selected = this.getItemByIndex(this.getSelectedIndex());
			this.options.initialVersion = 'any';

			// update version filter selector
			//
			this.updateVersionFilterSelector(function() {

				// perform callback
				//
				if (self.options && self.options.onChange && (!options || !options.silent)) {
					self.options.onChange({
						'platform': self.selected
					});
				}
			});
		}
	});
});
