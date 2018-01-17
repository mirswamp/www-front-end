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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'registry',
	'collections/packages/packages',
	'collections/packages/package-versions',
	'views/dialogs/error-view',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-selector-view'
], function($, _, Backbone, Registry, Packages, PackageVersions, ErrorView, GroupedNameSelectorView, VersionSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// constructor
		//

		initialize: function(attributes, options) {

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
					self.showVersion(self.options.versionSelector);
				}
			});
		},

		//
		// ajax methods
		//

		fetchPackages: function(success) {
			var self = this;
			var publicPackages = new Packages([]);

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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not fetch protected packages."
									})
								);						
							}
						});
					} else {
						success(publicPackages);
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch public packages."
						})
					);
				}
			});
		},

		//
		// querying methods
		//

		getSelectedName: function() {
			var selected = this.getSelected();
			if (selected) {
				return selected.get('name')
			} else {
				return undefined;
			}
		},

		//
		// rendering methods
		//

		showVersion: function(versionSelector) {
			var self = this;
			var selectedPackage = this.getSelected();

			if (typeof selectedPackage == 'undefined') {

				// only latest version available
				//
				var collection = new PackageVersions([{
					version_string: 'Latest'
				}]);

				// show version selector view
				//
				versionSelector.show(
					new VersionSelectorView({
						collection: collection,
						parentSelector: self,

						// callbacks
						//
						onChange: self.options.onChange
					})
				);
			} else {

				// fetch package versions
				//
				var collection = new PackageVersions([]);
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
						versionSelector.show(
							new VersionSelectorView({
								collection: collection,
								parentSelector: self,
								initialValue: self.options.initialVersion,

								// callbacks
								//
								onChange: self.options.onChange
							})
						);
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch collection of package versions."
							})
						);
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
			this.options.initialVersion = undefined;
			
			// update version selector
			//
			if (this.options.versionSelector) {
				this.showVersion(this.options.versionSelector);
			}

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
