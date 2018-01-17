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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'select2',
	'text!templates/widgets/selectors/grouped-name-selector.tpl',
	'registry',
	'collections/tools/tools',
	'collections/tools/tool-versions',
	'views/dialogs/error-view',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Backbone, Select2, Template, Registry, Tools, ToolVersions, ErrorView, GroupedNameSelectorView, VersionFilterSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// contructor
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
				})
			} else {

				// reset selection
				//
				this.setSelectedName('Any', options);
			}
		},

		update: function(options) {
			var self = this;

			// fetch tools
			//
			this.fetchTools(function(publicTools, protectedTools) {

				/*
				// combine tools
				//
				if (publicTools && protectedTools) {
					var tools = new Tools(publicTools.toArray().concat(protectedTools.toArray()));
				} else if (publicTools) {
					var tools = publicTools;
				} else {
					var tools = protectedTools;
				}

				// remove duplicate names
				//
				tools.removeDuplicateNames();
				publicTools = tools.getPublic();
				protectedTools = tools.getProtected();
				*/

				// sort by name
				//
				if (publicTools) {
					publicTools.sort();
				}
				if (protectedTools) {
					protectedTools.sort();
				}

				// create package lists
				//
				self.collection = new Backbone.Collection([{
					'name': 'Any',
					'model': null
				}, {
					'name': 'Protected Tools',
					'group': protectedTools || new Tools()
				}, {
					'name': 'Public Tools',
					'group': publicTools || new Tools()
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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch protected tools."
									})
								);						
							}
						});
					} else {
						success(publicTools);
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch public tools."
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
				return this.getSelected().get('name')
			} else {
				return "any tool";
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
			var enabled = [];

			if (this.options.packageSelected) {
				var packageType = this.options.packageSelected.get('package_type');

				// generate list of enabled tool names
				//
				var disabled = [];
				if (packageType != null) {
					this.collection.each( function(item, index, list) {
						if (group = item.get('group')) {
							group.each(function(tool) {
								if (tool.supports(packageType)) {
									enabled.push(tool);
								}
							});
						}
					});
				}
			} else {

				// return list of all tools
				//
				this.collection.each(function(item, index, list) {
					if (group = item.get('group')) {
						group.each(function(tool) {
							enabled.push(tool);
						});
					}
				});
			}

			return enabled;
		},

		getDisabled: function() {
			var disabled = [];

			if (typeof(this.options.packageSelected) != 'undefined') {
				var packageType = this.options.packageSelected.get('package_type');

				// generate list of disabled tools
				//
				if (packageType != null) {
					this.collection.each( function(item, index, list) {
						if (group = item.get('group')) {
							group.each(function(tool) {
								if (!tool.supports(packageType)) {
									disabled.push(tool);
								}
							});
						}
					});
				}
			}

			return disabled;
		},

		getToolNames: function(tools) {
			var names = [];
			for (var i = 0; i < tools.length; i++) {
				names.push(tools[i].get('name').toLowerCase());
			}
			return names;
		},

		//
		// rendering methods
		//

		template: function(data) {
			this.enabledItems = this.getEnabled();

			// add enabled tools
			//
			if (this.enabledItems) {
				var enabledToolNames = this.getToolNames(this.enabledItems);
				for (var i = 0; i < data.items.length; i++) {
					if (data.items[i].group) {
						var collection = new Backbone.Collection();
						var group = data.items[i].group;
						for (var j = 0; j < group.length; j++) {
							var item = data.items[i].group.at(j);
							if (_.contains(enabledToolNames, item.get('name').toLowerCase())) {
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
			var selectedTool = this.getSelected();

			if (selectedTool) {
				var collection = new ToolVersions([]);

				// fetch tool versions
				//
				collection.fetchByTool(selectedTool, {

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
								message: "Could not fetch collection of tool versions."
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
					'tool': this.selected
				});
			}
		}
	});
});
