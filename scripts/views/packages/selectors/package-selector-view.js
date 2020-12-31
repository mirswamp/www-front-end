/******************************************************************************\
|                                                                              |
|                             package-selector-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a software package from a list.     |
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
	'collections/packages/packages',
	'collections/packages/package-versions',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-selector-view'
], function($, _, Packages, PackageVersions, GroupedNameSelectorView, VersionSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// constructor
		//

		initialize: function(options) {

			// call superclass constructor
			//
			GroupedNameSelectorView.prototype.initialize.call(this, options);

			// set attributes
			//
			this.collection = new Backbone.Collection();

			// fetch and display
			//
			this.update();
		},

		//
		// setting methods
		//

		setProject: function(project, options) {

			// set attributes
			//
			this.options.project = project;

			// reset selection
			//
			this.reset(_.extend(options || {}, {
				update: true
			}));
		},

		setVersionString: function(versionString) {
			if (this.versionSelector) {
				this.versionSelector.currentView.setSelectedName(versionString);
			}
		},

		reset: function(options) {
			var self = this;
			if (options.update) {
				this.update({
					done: function() {

						// reset selection
						//
						if (options.package) {
							self.options.initialVersion = options.packageVersion;
							self.setSelectedName(options.package.get('name'));
						}
						//self.setSelectedName('Any', options);
					}
				});
			} else {

				// reset selection
				//
				self.options.initialVersion = options.packageVersion;
				this.setSelectedName(options.package.get('name'));
				//this.setSelectedName('Any', options);
			}
		},

		//
		// rendering methods
		//

		onRender: function() {

			// call superclass method
			//
			GroupedNameSelectorView.prototype.onRender.call(this);

			// initialize version selector
			//
			this.showVersion();
		},

		update: function(options) {
			var self = this;

			// remove existing options
			//
			this.clear();
			
			// fetch packages
			//
			this.fetchPackages(function(publicPackages, protectedPackages) {
				
				// don't show platform independent packages
				//
				if (self.options.showPlatformDependent) {
					publicPackages = publicPackages.getPlatformUserSelectable();
					protectedPackages = protectedPackages.getPlatformUserSelectable();
				}

				// distinguish repeated names
				//
				var namesCount = {};
				if (publicPackages) {
					publicPackages.distinguishRepeatedNames(namesCount);
				}
				if (protectedPackages) {
					protectedPackages.distinguishRepeatedNames(namesCount);
				}

				// sort by name
				//
				if (publicPackages) {
					publicPackages.sort();
				}
				if (protectedPackages) {
					protectedPackages.sort();
				}

				// set attributes
				//
				self.collection = new Backbone.Collection([{

					// no package is selected by default
					//
					'name': ''
				}, {
					'name': 'Protected Packages',
					'group': protectedPackages || new Packages()
				}, {
					'name': 'Public Packages',
					'group': publicPackages || new Packages()
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
				if (self.options.versionSelector) {
					self.showVersion();
				}
			});
		},

		//
		// ajax methods
		//

		fetchPackages: function(success) {
			var self = this;
			var publicPackages = new Packages([]);

			if (this.options.showPublicPackages) {

				// fetch public packages
				//
				publicPackages.fetchPublic({

					// callbacks
					//
					success: function() {
						if (self.options.project) {
							var protectedPackages = new Packages([]);

							// fetch protected packages
							//		
							protectedPackages.fetchProtected(self.options.project, {

								// callbacks
								//
								success: function() {
									success(publicPackages, protectedPackages);
								},

								error: function() {

									// show error message
									//
									application.error({
										message: "Could not fetch protected packages."
									});
								}
							});
						} else {
							success(publicPackages);
						}
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch public packages."
						});
					}
				});
			} else {
				if (self.options.project) {
					var protectedPackages = new Packages([]);

					// fetch protected packages
					//		
					protectedPackages.fetchProtected(self.options.project, {

						// callbacks
						//
						success: function() {
							success(publicPackages, protectedPackages);
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not fetch protected packages."
							});
						}
					});
				} else {
					success(null);
				}	
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

		//
		// rendering methods
		//

		showVersion: function() {
			var self = this;
			var selectedPackage = this.getSelected();
			var collection;

			if (!selectedPackage) {

				// only latest version available
				//
				collection = new PackageVersions([{
					version_string: 'Latest'
				}]);

				// show version selector view
				//
				this.options.versionSelectorRegion.show(new VersionSelectorView({
					collection: collection,
					parentSelector: self,
					searchable: true,

					// callbacks
					//
					onChange: self.options.onChange
				}));
			} else {

				// fetch package versions
				//
				collection = new PackageVersions([]);
				collection.fetchByPackageProject(selectedPackage, self.options.project, {

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
							searchable: true,

							// callbacks
							//
							onChange: function(options) {
								self.onChangeVersion(options);
							}
						}));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch collection of package versions."
						});
					}
				});
			}
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update selected
			//
			this.selected = this.getItemByIndex(this.getSelectedIndex());
			
			// update version selector
			//
			if (this.selected && this.options.versionSelectorRegion) {
				this.showVersion();
			}

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					'package': this.selected
				});
			}
		},

		onChangeVersion: function(options) {
			this.selected = this.getItemByIndex(this.getSelectedIndex());

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					'package': this.selected
				});
			}
		}
	});
});
