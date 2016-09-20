/******************************************************************************\ 
|                                                                              |
|                    package-version-source-profile-form-view.js               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's source          |
|        information.                                                          |
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
	'text!templates/packages/info/versions/info/source/source-profile/package-version-source-profile-form.tpl',
	'registry',
	'utilities/file-utils',
	'models/packages/package',
	'views/dialogs/error-view',
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, FileUtils, Package, ErrorView, PackageVersionGemInfoView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #select-package-path': 'onClickSelectPackagePath',
			'change [name="language-version"]': 'onChangeLanguageVersion',
			'click #show-gem-info': 'onClickShowGemInfo',
			'submit': 'onSubmit'
		},

		//
		// query methods
		//

		getPackagePath: function() {
			return this.$el.find('#package-path').val();
		},

		getLanguageVersion: function() {
			return this.$el.find('select[name=language-version]').val();
		},
		
		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				package: this.options.package
			}));
		},

		onRender: function() {
			var self = this;
			
			if (this.options.package.isNew()) {

				// set default package path and type 
				//
				if (this.getPackagePath() == '') {
					this.setDefaultPackagePath(function() {
						self.setDefaultPackageType();
					});
				} else {
					this.setDefaultPackageType();
				}
			} else {

				// existing packages
				//
				this.setDefaultPackagePath();
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// defaults setting methods
		//

		setDefaultPackagePath: function(done) {
			var self = this;

			// fetch package version directory tree
			//
			this.model.fetchFileTree({
				data: {
					'dirname': '.'
				},

				// callbacks
				//
				success: function(data) {
					if (_.isArray(data) || !isDirectoryName(data.name)) {
						self.$el.find('#package-path').val('.');
					} else {
						self.$el.find('#package-path').val(data.name);
					}

					// perform done callback
					//
					if (done) {
						done();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch directory tree for this package version."
						})
					);	
				}
			});
		},

		setDefaultPackageType: function() {
			var self = this;
			this.model.inferPackageTypes({
				data: {
					'dirname': this.getPackagePath()
				},

				// callbacks
				//
				success: function(packageTypes, languageVersions) {
					self.defaultPackageTypes = packageTypes;

					// check the selected package type against the defaults
					//
					self.checkPackageType(self.options.package.getPackageType());

					// set language version
					//
					if (languageVersions) {
						if (languageVersions[0]) {
							self.defaultLanguageVersion = languageVersions[0];

							// check selected language version against the defaults
							//
							self.checkLanguageVersion(self.model.get('language_version'));
						}
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch language for this package version."
						})
					);	
				}
			});
		},

		checkPackageType: function(packageType) {
			if (this.defaultPackageTypes.indexOf(Package.getTypeAlias(packageType)) == -1) {
				this.options.parent.showWarning("This package does not appear to contain the right type of files for a " + Package.packageTypeToName(packageType) + " package.");
				return false;
			} else {
				this.options.parent.hideWarning();
				return true;
			}
		},

		checkLanguageVersion: function(languageVersion) {

			// check specified language version against the default
			//
			if (this.defaultLanguageVersion) {
				if (languageVersion != this.defaultLanguageVersion) {
					this.options.parent.showWarning('The selected language version does not match the version specified in the package.');
				} else {
					this.options.parent.hideWarning();
				}
			}
		},

		//
		// form validation methods
		//

		isValid: function() {
			return this.validator.form();
		},

		validate: function() {
			return this.$el.find('form').validate();
		},

		//
		// form methods
		//

		update: function(packageVersion) {

			// update package version
			//
			packageVersion.set({
				'source_path': this.getPackagePath(),
				'language_version': this.getLanguageVersion()
			});
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onClickSelectPackagePath: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-view'
			], function (SelectPackageVersionDirectoryView) {

				// show select package version directory dialog
				//
				Registry.application.modal.show(
					new SelectPackageVersionDirectoryView({
						model: self.model,
						title: "Select Package Path",
						selectedDirectoryName: self.getPackagePath(),
						
						// callbacks
						//
						accept: function(selectedDirectoryName) {

							// set package path input
							//
							self.$el.find('#package-path').val(selectedDirectoryName);
						
							// perform callback
							//
							self.onChange();
						}
					}), {
						size: 'large'
					}
				);
			});
		},

		onChangeLanguageVersion: function() {
			this.checkLanguageVersion(this.getLanguageVersion());
		},

		onClickShowGemInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-gem-info-view'
			], function (PackageVersionGemInfoView) {

				// show package version gem info dialog
				//
				Registry.application.modal.show(
					new PackageVersionGemInfoView({
						model: self.model,
						packagePath: self.getPackagePath()
					}), {
						size: 'large'
					}
				);
			});
		}
	});
});
