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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'validate',
	'tooltip',
	'popover',
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
	'views/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package-form-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, Accordions, PlatformVersions, ErrorView, SelectPackageVersionDirectoryView, PackageDependenciesEditableListView, CPackageFormView, JavaSourcePackageFormView, JavaBytecodePackageFormView, AndroidSourcePackageFormView, AndroidBytecodePackageFormView, PythonPackageFormView, RubyPackageFormView) {
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
			'change input': 'onChangeInput',
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
			var packageType = this.options.package.getPackageType();

			// show subviews
			//
			this.showPackageDependencies();

			if (this.options.package) {
				this.showPackageType(packageType);
			}

			// infer default build system
			//
			if (!this.model.has('build_system')) {
				this.setDefaultBuildSystem(packageType);
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
						self.packageTypeForm.currentView.setBuildSystem(buildSystem);
						var notice = "This package appears to use the '" + self.packageTypeForm.currentView.getBuildSystemName(buildSystem) + "' build system. ";
						var isWheel = self.model.getFilename().endsWith('.whl');
						var isApk = self.model.getFilename().endsWith('.apk');

						// notify if build system can be changed
						//
						if (buildSystem != 'ruby-gem' && !isWheel && !isApk) {
							notice += " You can set the build system if this is not correct."
						}
						self.options.parent.showNotice(notice);
					},

					error: function() {

						// set to default build system for each package type
						//
						self.packageTypeForm.currentView.setBuildSystem();
					}
				});
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
			if (this.packageTypeForm.currentView) {
				this.packageTypeForm.currentView.update(packageVersion);
			}
		},

		//
		// event handling methods
		//

		onChange: function() {
			this.checkBuildSystem();
			
			// call on change callback
			//
			if (this.options.onChange) {
				this.options.onChange();
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
			this.onChange();
		},

		onBlurInput: function(event) {
			this.focusedInput = null;
			this.onChange();
		}
	});
});
