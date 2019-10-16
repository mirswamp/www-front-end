/******************************************************************************\
|                                                                              |
|                         build-profile-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for entering a package's build info.         |
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
	'text!templates/packages/info/versions/info/build/build-profile/build-profile-form.tpl',
	'widgets/accordions',
	'collections/platforms/platform-versions',
	'views/forms/form-view',
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
], function($, _, Template, Accordions, PlatformVersions, FormView, PackageDependenciesEditableListView, PackageTypeFormView, CPackageFormView, JavaSourcePackageFormView, JavaBytecodePackageFormView, AndroidSourcePackageFormView, AndroidBytecodePackageFormView, PythonPackageFormView, RubyPackageFormView, WebScriptingPackageFormView, DotNetPackageFormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-form',
			dependencies_list: '#package-dependencies-list'
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

			'click #add-new-dependency': 'onClickAddNewDependency'
		},

		//
		// query methods
		//

		getCurrentModel: function() {
			var model = this.model.clone();
			this.applyTo(model);

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
			return this.getChildView('form').getBuildSystem();
		},

		getBuildSystemName: function(buildSystem) {
			if (this.getChildView('form').getBuildSystemName) {
				return this.getChildView('form').getBuildSystemName(buildSystem);
			}
		},
		
		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
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

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		showPackageDependencies: function() {
			var self = this;
			this.platformVersions = new PlatformVersions();
			this.platformVersions.fetchAll({

				// callbacks
				//
				success: function() {

					// show editable package dependencies list view
					//
					self.showChildView('dependencies_list', new PackageDependenciesEditableListView({
						model: self.model,
						collection: self.options.packageVersionDependencies,
						deletedItems: self.options.deletedPackageVersionDependencies,
						platformVersions: self.platformVersions,
						showDelete: true,
						parent: self,

						// callbacks
						//
						onChange: function() {
							self.onChange();
						}
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
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
					this.showChildView('form', new CPackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;

				// java package types
				//
				case 'java7-source':
				case 'java8-source':
					this.showChildView('form', new JavaSourcePackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;
				case 'java7-bytecode':
				case 'java8-bytecode':
					this.showChildView('form', new JavaBytecodePackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;

				// android package types
				//
				case 'android-source':
					this.showChildView('form', new AndroidSourcePackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;
				case 'android-bytecode':
					this.showChildView('form', new AndroidBytecodePackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;

				// python package types
				//
				case 'python2':
				case 'python3':
					this.showChildView('form', new PythonPackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;

				// ruby package types
				//
				case 'ruby':
				case 'sinatra':
				case 'rails':
				case 'padrino':
					this.showChildView('form', new RubyPackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;

				// web scripting package type
				//
				case 'web-scripting':
					this.showChildView('form',new WebScriptingPackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;

				// .net package type
				//
				case '.net':
					this.showChildView('form', new DotNetPackageFormView({
						model: this.model,
						package: this.options.package,
						parent: this
					}));
					break;
			}

			// set on change callback
			//
			if (this.hasChildView('form')) {
				var self = this;
				this.getChildView('form').options.onChange = function() {
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
			if (this.getChildView('form') && this.getChildView('form').setBuildSystem) {
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
						self.getChildView('form').setBuildSystem(buildSystem);

						// show notice about current build system
						//
						if (self.model.has('build_system')) {
							self.showNotice();
						}
					},

					error: function() {

						// set to default build system for each package type
						//
						self.getChildView('form').setBuildSystem();
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
				if (buildSystemName) {
					var notice = "This package appears to use the '" + buildSystemName + "' build system. ";
					var isWheel = this.model.getFilename().endsWith('.whl');
					var isApk = this.model.getFilename().endsWith('.apk');

					// notify if build system can be changed
					//
					if (buildSystem != 'ruby-gem' && buildSystem != 'msbuild' && !isWheel && !isApk) {
						notice += " You can set the build system if this is not correct.";
					}
					this.options.parent.showNotice(notice);
				}
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
			if (this.getChildView('form') && this.getChildView('form').validate) {
				this.getChildView('form').validate();
			}
		},

		isValid: function() {
			return (!this.getChildView('form') || this.getChildView('form').isValid());
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

		applyTo: function(packageVersion) {

			// update model from sub view
			//
			if (this.hasChildView('form') &&
				this.getChildView('form').applyTo) {
				this.getChildView('form').applyTo(packageVersion);
			}
		},

		//
		// event handling methods
		//

		onChange: function() {

			// update model
			//
			if (this.hasChildView('form')) {
				this.model.set(this.getChildView('form').getValues());
			}
			
			// call on change callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onChangeBuild: function() {

			// update model
			//
			this.model.set(this.getChildView('form').getValues());

			// recheck build system
			//
			var buildSystem = this.getChildView('form').getBuildSystem();
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
		},

		//
		// mouse event handling methods
		//

		onClickAddNewDependency: function() {
			var self = this;
			require([
				'views/packages/info/versions/info/build/dependencies/editable-list/dialogs/add-new-package-dependency-dialog-view'
			], function (AddNewPackageDependencyDialogView) {

				// show add new package dependency dialog
				//
				application.show(new AddNewPackageDependencyDialogView({
					packageVersion: self.model,
					collection: self.options.packageVersionDependencies,
					platformVersions: self.platformVersions,

					// callbacks
					//
					onAdd: function() {
						self.onChange();
					}
				}));
			});
		}
	});
});