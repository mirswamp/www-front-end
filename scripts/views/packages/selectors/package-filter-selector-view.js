/******************************************************************************\
|                                                                              |
|                          package-filter-selector-view.js                     |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'registry',
	'models/projects/project',
	'collections/projects/projects',
	'collections/packages/packages',
	'collections/packages/package-versions',
	'views/dialogs/error-view',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Backbone, Registry, Project, Projects, Packages, PackageVersions, ErrorView, GroupedNameSelectorView, VersionFilterSelectorView) {
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
				});
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

				// create package lists
				//
				self.collection = new Backbone.Collection([{
					'name': "Any",
					'model': null
				}, {
					'name': "Protected Packages",
					'group': protectedPackages || new Packages()
				}, {
					'name': "Public Packages",
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

		fetchProjectProtectedPackages: function(project, done) {
			var protectedPackages = new Packages([]);

			// fetch protected packages for this project
			//
			protectedPackages.fetchProtected(project, {

				// callbacks
				//
				success: function() {
					done(protectedPackages);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch protected packages for this project."
						})
					);						
				}
			});
		},

		fetchProjectsProtectedPackages: function(projects, done) {
			var protectedPackages = new Packages([]);

			// fetch protected packages for all projects
			//
			protectedPackages.fetchAllProtected(projects, {

				// callbacks
				//
				success: function() {
					done(protectedPackages);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch protected packages for all projects."
						})
					);						
				}
			});
		},

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

						// fetch protected packages for a single project
						//
						self.fetchProjectProtectedPackages(self.options.project, function(protectedPackages) {
							success(publicPackages, protectedPackages);
						});
					} else if (self.options.projects && self.options.projects.length > 0) {
						
						// fetch protected packages for multiple projects
						//
						self.fetchProjectsProtectedPackages(self.options.projects, function(protectedPackages) {
							success(publicPackages, protectedPackages);
						});
					} else {

						// only public packages
						//
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

		fetchPackageVersions: function(package, done) {
			var collection = new PackageVersions([]);

			if (this.options.project) {

				// a single project
				//
				collection.fetchByPackageProject(package, this.options.project, {

					// callbacks
					//
					success: function() {

						// perform callback
						//
						done(collection);
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch package versions."
							})
						);
					}
				});
			} else if (this.options.projects && this.options.projects.length > 0) {

				// multiple projects
				//
				collection.fetchByPackageProjects(package, this.options.projects, {

					// callbacks
					//
					success: function() {

						// perform callback
						//
						done(collection);
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch package versions."
							})
						);
					}
				});
			} else {

				// no project or projects
				//
				done(collection);
			}
		},

		//
		// name querying methods
		//

		getSelectedName: function() {
			if (this.hasSelected()) {
				return this.getSelected().get('name');
			} else {
				return "any package";
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
				var description = this.getSelectedName();
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
		// rendering methods
		//

		showVersionFilter: function(versionFilterSelector, done) {
			var self = this;
			var selectedPackage = this.getSelected();
			
			if (selectedPackage) {
				this.fetchPackageVersions(selectedPackage, function(collection) {

					// show version filter selector view
					//
					versionFilterSelector.show(
						new VersionFilterSelectorView({
							collection: collection,
							initialValue: self.options.initialVersion,
							defaultOptions: self.options.versionDefaultOptions,
							selectedOptions: self.options.versionSelectedOptions,
							searchable: true,

							// callbacks
							//
							onChange: function(changes) {

								// perform callback
								//
								if (self.options && self.options.onChange) {
									self.options.onChange({
										'package-version': changes.version
									});
								}
							}
						})
					);

					// perform callback
					//
					if (done) {
						done();
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
			this.selected = this.getItemByIndex(this.getSelectedIndex());
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
					'package': this.selected
				});
			}
		}
	});
});
