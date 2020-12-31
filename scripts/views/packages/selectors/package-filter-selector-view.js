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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'models/projects/project',
	'collections/projects/projects',
	'collections/packages/packages',
	'collections/packages/package-versions',
	'views/widgets/selectors/grouped-name-selector-view',
	'views/widgets/selectors/version-filter-selector-view'
], function($, _, Project, Projects, Packages, PackageVersions, GroupedNameSelectorView, VersionFilterSelectorView) {
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
					name: 'Any',
					model: null
				}, {
					name: 'Protected Packages',
					group: protectedPackages || new Packages()
				}, {
					name: 'Public Packages',
					group: publicPackages || new Packages()
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

					// show error message
					//
					application.error({
						message: "Could not fetch protected packages for this project."
					});
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

					// show error message
					//
					application.error({
						message: "Could not fetch protected packages for all projects."
					});
				}
			});
		},

		fetchPackages: function(success) {
			var self = this;
			var publicPackages = new Packages([]);

			// fetch public packages
			//
			if (this.options.showPublicPackages) {
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

						// show error message
						//
						application.error({
							message: "Could not fetch public packages."
						});
					}
				});
			} else {
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
			}
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

						// show error message
						//
						application.error({
							message: "Could not fetch package versions."
						});
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

						// show error message
						//
						application.error({
							message: "Could not fetch package versions."
						});
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
							'package-version': changes.version
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
					this.fetchPackageVersions(this.selected, function(collection) {
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
