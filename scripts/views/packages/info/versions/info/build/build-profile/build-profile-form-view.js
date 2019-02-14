/******************************************************************************\
|                                                                              |
|                             build-profile-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a package versions's            |
|        build information.                                                    |
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
	'marionette',
	'jquery.validate',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/packages/info/versions/info/build/build-profile/build-profile-form.tpl',
	'registry',
	'widgets/accordions',
	'collections/platforms/platform-versions',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-view',
	'views/packages/info/versions/info/build/dependencies/editable-list/package-dependencies-editable-list-view',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/c/c-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/java-source/java-source-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/java-bytecode/java-bytecode-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/android-source/android-source-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/android-bytecode/android-bytecode-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/python/python-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/web-scripting/web-scripting-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/dot-net/dot-net-package-form-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, Accordions, PlatformVersions, ErrorView, SelectPackageVersionDirectoryView, PackageDependenciesEditableListView, PackageTypeFormView, CPackageFormView, JavaSourcePackageFormView, JavaBytecodePackageFormView, AndroidSourcePackageFormView, AndroidBytecodePackageFormView, PythonPackageFormView, RubyPackageFormView, WebScriptingPackageFormView, DotNetPackageFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageDependenciesForm: '#package-dependencies-form',
			packageTypeForm: '#package-type-form'
		},

		events: {

			// form validation events
			//
			'change select': 'onChange',
			'input input': 'onChange',
			'input textarea': 'onChange',

			// build system validation events
			//
			/*
			'change #build-system': 'onChangeBuild',
			'change #build-path input': 'onChangeBuild',
			'change #build-file input': 'onChangeBuild'
			*/
		},

		//
		// query methods
		//

		getCurrentModel: function() {
			var model = this.model.clone();
			this.update(model);

			// set package type id for new packages
			//
			if (model.isNew()) {
				model.set({
					'package_type_id': this.options.package.get('package_type_id')
				});
			}
			
			return model;
		},

		getBuildSystem: function() {
			return this.packageTypeForm.currentView.getBuildSystem();
		},

		getBuildSystemName: function(buildSystem) {
			return this.packageTypeForm.currentView.getBuildSystemName(buildSystem);
		},
		
		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {
			var self = this;
			var packageType = this.options.package.getPackageType();

			// show subviews
			//
			this.showPackageDependencies();

			// infer default build system
			//
			if (this.model.isNew()) {
				this.setDefaultBuildInfo({

					// callbacks
					//
					success: function() {

						// show build info for specific package type
						//
						self.showPackageType(packageType);

						// show notice about current build system
						//
						if (packageType != '.net') {
							if (self.model.has('build_system')) {
								self.showNotice();
							}
						}

						// validate the form
						//
						self.validator = self.validate();

						// notify of change
						//
						self.onChange();
					},

					error: function() {

						// show build info for specific package type
						//
						self.showPackageType(packageType);
					}
				});
			} else {

				// show build info for specific package type
				//
				this.showPackageType(packageType);

				// validate the form
				//
				this.validator = this.validate();
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		showPackageDependencies: function() {
			var self = this;
			var platformVersions = new PlatformVersions();
			platformVersions.fetchAll({

				// callbacks
				//
				success: function() {

					// show editable package dependencies list view
					//
					self.packageDependenciesForm.show(
						new PackageDependenciesEditableListView({
							model: self.model,
							collection: self.options.packageVersionDependencies,
							deletedItems: self.options.deletedPackageVersionDependencies,
							platformVersions: platformVersions,
							showDelete: true,
							parent: self,

							// callbacks
							//
							onChange: function() {
								self.onChange();
							}
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.error({
						message: "Could not fetch package dependencies."
					});
				}
			});
		},

		hidePackageDependencies: function() {
			this.packageDependenciesForm.$el.hide();
		},

		showPackageType: function(packageType) {
			switch (packageType) {

				// C/C++ package types
				//
				case 'c-source':
					this.packageTypeForm.show(
						new CPackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;

				// java package types
				//
				case 'java7-source':
				case 'java8-source':
					this.packageTypeForm.show(
						new JavaSourcePackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;
				case 'java7-bytecode':
				case 'java8-bytecode':
					this.packageTypeForm.show(
						new JavaBytecodePackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;

				// android package types
				//
				case 'android-source':
					this.packageTypeForm.show(
						new AndroidSourcePackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;
				case 'android-bytecode':
					this.packageTypeForm.show(
						new AndroidBytecodePackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;

				// python package types
				//
				case 'python2':
				case 'python3':
					this.packageTypeForm.show(
						new PythonPackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;

				// ruby package types
				//
				case 'ruby':
				case 'sinatra':
				case 'rails':
				case 'padrino':
					this.packageTypeForm.show(
						new RubyPackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;

				// web scripting package type
				//
				case 'web-scripting':
					this.packageTypeForm.show(
						new WebScriptingPackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;

				// .net package type
				//
				case '.net':
					this.packageTypeForm.show(
						new DotNetPackageFormView({
							model: this.model,
							package: this.options.package,
							parent: this
						})
					);
					break;
			}

			// set on change callback
			//
			if (this.packageTypeForm.currentView) {
				var self = this;
				this.packageTypeForm.currentView.options.onChange = function() {
					self.onChange();
				};
			}
		},

		setDefaultBuildInfo: function(options) {
			var self = this;

			// fetch and set default build info
			//
			this.model.fetchBuildInfo({
				data: {
					'package_type_id': this.options.package.get('package_type_id')
				},

				// callbacks
				//
				success: function(buildInfo) {

					// set model attributes
					//
					self.model.set({
						'build_system': buildInfo['build_system'],
						'config_dir': buildInfo['config_dir'],
						'config_cmd': buildInfo['config_cmd'],
						'config_opt': buildInfo['config_opt'],
						'build_dir': buildInfo['build_dir'],
						'build_file': buildInfo['build_file'],
						'build_cmd': buildInfo['build_cmd'],
						'no_build_cmd': buildInfo['no_build_cmd'],
						'build_opt': buildInfo['build_opt'],
						'package_info': buildInfo['package_info']
					});

					// peform callback
					//
					if (options && options.success) {
						options.success();
					}
				},

				error: function() {

					// perform callback
					//
					if (options && options.error) {
						options.error();
					}
				}
			});
		},

		setDefaultBuildSystem: function(packageType) {

			// check to see if method to set build system exists
			//
			if (this.packageTypeForm.currentView && this.packageTypeForm.currentView.setBuildSystem) {
				var self = this;

				// fetch and set default build system
				//
				this.model.fetchBuildSystem({
					data: {
						'package_type_id': this.options.package.get('package_type_id')
					},

					// callbacks
					//
					success: function(buildSystem) {
						
						// set build system
						//
						self.packageTypeForm.currentView.setBuildSystem(buildSystem);

						// show notice about current build system
						//
						if (self.model.has('build_system')) {
							self.showNotice();
						}
					},

					error: function() {

						// set to default build system for each package type
						//
						self.packageTypeForm.currentView.setBuildSystem();
					}
				});
			}
		},

		showNotice: function() {
			var buildSystem = this.model.get('build_system');

			if (buildSystem && buildSystem != 'no-build' && buildSystem != 'none') {

				// build system found
				//
				var buildSystemName = this.getBuildSystemName(buildSystem);
				var notice = "This package appears to use the '" + buildSystemName + "' build system. ";
				var isWheel = this.model.getFilename().endsWith('.whl');
				var isApk = this.model.getFilename().endsWith('.apk');

				// notify if build system can be changed
				//
				if (buildSystem != 'ruby-gem' && buildSystem != 'msbuild' && !isWheel && !isApk) {
					notice += " You can set the build system if this is not correct.";
				}
				this.options.parent.showNotice(notice);
				this.options.parent.hideWarning();
				if (this.options.parent.setNextDisabled) {
					this.options.parent.setNextDisabled(false);
				}
			} else if (buildSystem == 'no-build') {
				this.options.parent.showNotice(PackageTypeFormView.prototype.messages[buildSystem]);

				// no build system
				//
				if (!this.model.has('no_build_cmd')) {

					// no build system found and no build command
					//
					this.options.parent.showWarning('No assessable file types were found in the selected package path (recursively).');
					if (this.options.parent.setNextDisabled) {
						this.options.parent.setNextDisabled(true);
					}
				} else {

					// no build system found but build commend found
					//
					this.options.parent.hideWarning();
					if (this.options.parent.setNextDisabled) {
						this.options.parent.setNextDisabled(false);
					}
				}
			}			
		},

		//
		// form validation methods
		//
		
		validate: function() {

			// check build system
			//
			this.checkBuildSystem();

			// validate sub views
			//
			if (this.packageTypeForm.currentView && this.packageTypeForm.currentView.validate) {
				this.packageTypeForm.currentView.validate();
			}
		},

		isValid: function() {
			return (!this.packageTypeForm.currentView || this.packageTypeForm.currentView.isValid());
		},

		//
		// build system validation methods
		//

		checkBuildSystem: function() {
			var self = this;
			var model = this.getCurrentModel();

			// check build system
			//
			model.checkBuildSystem({

				// callbacks
				//
				success: function() {
					self.options.parent.hideWarning();
				},

				error: function(data) {
					self.options.parent.showWarning(data.responseText);
				}
			});
		},

		//
		// form methods
		//

		update: function(packageVersion) {

			// update model from sub view
			//
			if (this.packageTypeForm &&
				this.packageTypeForm.currentView &&
				this.packageTypeForm.currentView.update) {
				this.packageTypeForm.currentView.update(packageVersion);
			}
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update model
			//
			this.update(this.model);
			
			// call on change callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onChangeBuild: function() {

			// update model
			//
			this.update(this.model);

			// recheck build system
			//
			var buildSystem = this.packageTypeForm.currentView.getBuildSystem();
			if (buildSystem != '.net') {
				this.checkBuildSystem();
			}

			// call on change callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onChangeInput: function() {
			this.onChange();
		}
	});
});