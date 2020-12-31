/******************************************************************************\
|                                                                              |
|                             platform-selector-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a software platform from a list.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'select2',
	'collections/platforms/platforms',
	'collections/platforms/platform-versions',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-selector-view'
], function($, _, Select2, Platforms, PlatformVersions, GroupedNameSelectorView, VersionSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// constructor
		//

		initialize: function(options) {

			// set optional parameter defaults
			//
			if (options.allowLatest == undefined) {
				options.allowLatest = false;
			}

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

			// fetch public platforms
			//
			publicPlatforms.fetchPublic({

				// callbacks
				//
				success: function() {
					if (self.options.project) {
						var protectedPlatforms = new Platforms([]);

						// fetch protected platforms
						//
						protectedPlatforms.fetchProtected(self.options.project, {

							// callbacks
							//
							success: function() {
								success(publicPlatforms, protectedPlatforms);
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not fetch protected platforms."
								});
							}
						});
					} else {
						success(publicPlatforms);
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch public platforms."
					});
				}
			});
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

		getEnabled: function(platforms) {

			// filter by tool
			//
			if (this.options.toolSelected) {
				platforms = platforms.getByTool(this.options.toolSelected);
			} 

			return platforms;
		},

		getSelectedVersion: function() {
			return this.options.versionSelectorRegion.currentView.getSelected();
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
			var selectedPlatform = this.getSelected();
			var collection;
			
			if (!selectedPlatform) {
				
				// create collection of platform versions
				//
				if (this.options.allowLatest) {
					collection = new PlatformVersions([{
						version_string: 'Latest'
					}]);
				} else {
					collection = new PlatformVersions();
				}

				// show version selector view
				//
				this.options.versionSelectorRegion.show(new VersionSelectorView({
					collection: collection,
					parentSelector: self,
					initialValue: self.options.initialVersion,

					// callbacks
					//
					onChange: self.options.onChange
				}));
			} else {

				// fetch platform versions
				//
				collection = new PlatformVersions([]);
				collection.fetchByPlatform(selectedPlatform, {

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
						if (self.options.allowLatest) {
							collection.add({
								version_string: 'Latest'
							}, {
								at: 0
							});
						}

						// show version selector view
						//
						self.options.versionSelectorRegion.show(new VersionSelectorView({
							collection: collection,
							parentSelector: self,

							// callbacks
							//
							onChange: self.options.onChange
						}));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch collection of platform versions."
						});
					}
				});
			}
		},

		update: function(options) {
			var self = this;

			// fetch platforms
			//
			this.fetchPlatforms(function(publicPlatforms, protectedPlatforms) {

				// cull Android from available platforms
				//
				if (self.options.packageSelected) {
					if (self.options.packageSelected.getPackageType() == 'c-source') {
						var item;

						// remove public platforms
						//
						for (var i = 0; i < publicPlatforms.length; i++) {
							item = publicPlatforms.at(i);
							if (item.get('name').contains('Android')) {
								publicPlatforms.remove(item);
							}
						}

						// remove protected platforms
						//
						for (var j = 0; j < protectedPlatforms.length; j++) {
							item = protectedPlatforms.at(j);
							if (item.get('name').contains('Android')) {
								protectedPlatforms.remove(item);
							}
						}
					}
				}

				// sort by name
				//
				if (publicPlatforms) {
					publicPlatforms.sort();
				}
				if (protectedPlatforms) {
					protectedPlatforms.sort();
				}

				// filter platforms
				//
				publicPlatforms = self.getEnabled(publicPlatforms);
				protectedPlatforms = self.getEnabled(protectedPlatforms);

				// set collection
				//
				self.collection = new Backbone.Collection([{

					// no platform is selected by default
					//
					'name': ''
				},{
					'name': 'Protected Platforms',
					'group': protectedPlatforms || new Platforms()
				}, {
					'name': 'Public Platforms',
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
					'platform': this.selected
				});
			}
		}
	});
});
