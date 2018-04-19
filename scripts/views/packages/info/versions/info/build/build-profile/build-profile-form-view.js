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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
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
	'views/packages/info/versions/info/build/build-profile/package-type/c/c-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/java-source/java-source-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/java-bytecode/java-bytecode-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/android-source/android-source-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/android-bytecode/android-bytecode-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/python/python-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package-form-view',
	'views/packages/info/versions/info/build/build-profile/package-type/web-scripting/web-scripting-package-form-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, Accordions, PlatformVersions, ErrorView, SelectPackageVersionDirectoryView, PackageDependenciesEditableListView, CPackageFormView, JavaSourcePackageFormView, JavaBytecodePackageFormView, AndroidSourcePackageFormView, AndroidBytecodePackageFormView, PythonPackageFormView, RubyPackageFormView, WebScriptingPackageFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageDependenciesForm: '#package-dependencies-form',
			packageTypeForm: '#package-type-form'
		},

		events: {
			'change select': 'onChangeSelect',
			'input input': 'onChangeInput',
			'input textarea': 'onChangeInput',
			'keyup input': 'onChangeInput',
			'focus input': 'onFocusInput',
			'focus select': 'onFocusInput',
			'blur input': 'onBlurInput',
			'blur select': 'onBlurInput'
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
				})
			}
			
			return model;
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
						if (self.model.has('build_system')) {
							self.showNotice();
						}

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
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// validate the form
			//
			this.validator = this.validate();
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
							parent: this
						})
					);
					break;
				case 'java7-bytecode':
				case 'java8-bytecode':
					this.packageTypeForm.show(
						new JavaBytecodePackageFormView({
							model: this.model,
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
							parent: this
						})
					);
					break;
				case 'android-bytecode':
					this.packageTypeForm.show(
						new AndroidBytecodePackageFormView({
							model: this.model,
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
				}
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
						'build_dir': buildInfo['build_dir'],
						'build_file': buildInfo['build_file']
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
			if (buildSystem && buildSystem != 'none') {
				var buildSystemName = this.packageTypeForm.currentView.getBuildSystemName(buildSystem);
				var notice = "This package appears to use the '" + buildSystemName + "' build system. ";
				var isWheel = this.model.getFilename().endsWith('.whl');
				var isApk = this.model.getFilename().endsWith('.apk');

				// notify if build system can be changed
				//
				if (buildSystem != 'ruby-gem' && !isWheel && !isApk) {
					notice += " You can set the build system if this is not correct."
				}
				this.options.parent.showNotice(notice);
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
			if (this.packageTypeForm.currentView) {
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

			// check build system
			//
			this.getCurrentModel().checkBuildSystem({

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
			
			// call on change callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}

			// recheck build system
			//
			if (!this.timeout) {
				var self = this;
				this.timeout = window.setTimeout(function() {
					self.checkBuildSystem();
					self.timeout = null;
				}, 1000);
			}
		},

		onChangeSelect: function() {
			this.onChange();
		},

		onChangeInput: function() {
			this.onChange();
		},

		onFocusInput: function(event) {
			this.focusedInput = $(event.target).attr('id');
		},

		onBlurInput: function(event) {
			this.focusedInput = null;
			this.onChange();
		}
	});
});