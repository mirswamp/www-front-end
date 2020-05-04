/******************************************************************************\
|                                                                              |
|                            tool-filter-selector-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a tool filter from a list.          |
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
	'collections/tools/tools',
	'collections/tools/tool-versions',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Select2, Tools, ToolVersions, GroupedNameSelectorView, VersionFilterSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// contructor
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

		setPackage: function(package, options) {

			// set attributes
			//
			this.options.packageSelected = package;

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

		fetchTools: function(success) {
			var self = this;
			var publicTools = new Tools([]);

			// fetch public tools
			//
			publicTools.fetchPublic({

				// callbacks
				//
				success: function() {
					if (self.options.project) {
						var protectedTools = new Tools([]);

						// fetch protected tools
						//
						protectedTools.fetchProtected(self.options.project, {

							// callbacks
							//
							success: function() {
								success(publicTools, protectedTools);
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch protected tools."
								});
							}
						});
					} else {
						success(publicTools);
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch public tools."
					});
				}
			});
		},

		fetchToolVersions: function(tool, done) {
			var self = this;
			var collection = new ToolVersions([]);

			// fetch tool versions
			//
			collection.fetchByTool(tool, {

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
						message: "Could not fetch collection of tool versions."
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
				return "any tool";
			}
		},

		hasSelectedName: function() {
			return (this.getSelected() !== null) && (this.getSelected() != undefined);
		},

		getEnabled: function(tools) {

			// filter by package type
			//
			if (this.options.packageSelected) {
				var packageType = this.options.packageSelected.get('package_type');
				tools = tools.getByPackageType(packageType);
			}

			// filter by platform
			//
			if (this.options.platformSelected) {
				tools = tools.getByPlatform(this.options.platformSelected);
			}

			return tools;
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
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.options.initialValue
			};
		},

		update: function(options) {
			var self = this;

			// fetch tools
			//
			this.fetchTools(function(publicTools, protectedTools) {
				
				if (publicTools) {

					// sort by name
					//
					publicTools.sort();

					// filter tools
					//
					publicTools = self.getEnabled(publicTools);
				}

				if (protectedTools) {

					// sort by name
					//
					protectedTools.sort();

					// filter tools
					//
					protectedTools = self.getEnabled(protectedTools);
				}
				
				// set collection
				//
				self.collection = new Backbone.Collection([{
					name: 'Any',
					model: null
				}, {
					name: 'Protected Tools',
					group: protectedTools || new Tools()
				}, {
					name: 'Public Tools',
					group: publicTools || new Tools()
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
		// version rendering methods
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
							'tool-version': changes.version
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
					this.fetchToolVersions(this.selected, function(collection) {
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
						'package': self.selected
					});
				}
			});
		}
	});
});
