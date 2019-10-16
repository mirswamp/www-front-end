/******************************************************************************\
|                                                                              |
|                               tool-selector-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a software tool from a list.        |
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
	'select2',
	'config',
	'collections/tools/tools',
	'collections/tools/tool-versions',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-selector-view'
], function($, _, Select2, Config, Tools, ToolVersions, GroupedNameSelectorView, VersionSelectorView) {
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
			this.selected = this.options.initialValue;

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
						self.setSelectedName('All', options);
					}
				});
			} else {

				// reset selection
				//
				this.setSelectedName('All', options);
			}
		},

		//
		// ajax methods
		//

		fetchTools: function(success) {
			var self = this;
			var publicTools = new Tools([]);

			if (!this.options.project || this.options.project.allowPublicTools()) {

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
			} else {
				var protectedTools = new Tools([]);

				// fetch protected tools
				//
				protectedTools.fetchProtected(this.options.project, {

					// callbacks
					//
					success: function() {
						success(null, protectedTools);
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch protected tools."
						});
					}
				});
			}
		},

		//
		// querying methods
		//

		getSelectedName: function() {
			var selected = this.getSelected();
			if (selected) {
				return selected.get('name');
			} else {
				return undefined;
			}
		},

		getEnabled: function(tools) {

			// filter by package type
			//
			if (typeof(this.options.packageSelected) != 'undefined') {
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
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.options.initialValue
			};
		},

		showVersion: function() {
			var self = this;
			var selectedTool = this.getSelected();

			if (!selectedTool || selectedTool == 'All') {

				// only latest version available
				//
				var collection = new ToolVersions([{
					version_string: 'Latest'
				}]);

				// show version selector view
				//
				this.options.versionSelectorRegion.show(new VersionSelectorView({
					collection: collection,
					parentSelector: self,
					initialValue: self.options.initialVersion,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				}));
			} else {

				// find selected package type
				//
				if (this.options.packageSelected) {
					var packageType = this.options.packageSelected.get('package_type');
				} else {
					packageType = null;
				}

				// fetch tool versions
				//
				var collection = new ToolVersions([]);
				collection.fetchByToolAndPackageType(selectedTool, packageType, {

					// callbacks
					//
					success: function() {

						// sort by version string
						//
						collection.sort({
							reverse: true
						});

						// add latest option
						//
						collection.add({
							version_string: 'Latest'
						}, {
							at: 0
						});

						// show version selector view
						//
						self.options.versionSelectorRegion.show(new VersionSelectorView({
							collection: collection,
							parentSelector: self,
							initialValue: self.options.initialVersion,

							// callbacks
							//
							onChange: self.options.onChange
						}));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch collection of tool versions."
						});
					}
				});
			}
		},

		update: function(options) {
			var self = this;

			// fetch tools
			//
			this.fetchTools(function(publicTools, protectedTools) {
		
				// sort by name
				//
				if (publicTools) {
					publicTools.sort();
				}
				if (protectedTools) {
					protectedTools.sort();
				}

				// filter tools
				//
				publicTools = self.getEnabled(publicTools);
				protectedTools = self.getEnabled(protectedTools);

				// set collection
				//
				self.collection = new Backbone.Collection();
				if (Config.options.assessments.allow_multiple_tool_selection) {
					self.collection.add({

						// 'all' is selected by default
						//
						name: 'All',
						model: null
					});
				}
				self.collection.add({
					name: 'Protected Tools',
					group: protectedTools || new Tools()
				});
				if (self.options.project.allowPublicTools()) {
					self.collection.add({
						name: 'Public Tools',
						group: publicTools || new Tools()
					});
				}

				// find enabled items
				//
				// self.enabled = self.getEnabled();
				
				// render
				//
				self.render();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}

				// show version selector
				//
				if (self.options.versionSelectorRegion) {
					self.showVersion();
				}
			});
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update selected
			//
			this.selected = this.getItemByIndex(this.getSelectedIndex());
			this.options.initialVersion = undefined;
			
			// update version selector
			//
			if (this.selected && this.options.versionSelectorRegion) {
				this.showVersion();
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
