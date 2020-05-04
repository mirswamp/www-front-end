/******************************************************************************\ 
|                                                                              |
|                 package-version-source-profile-form-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a package version's source           |
|        profile info.                                                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/source/source-profile/package-version-source-profile-form.tpl',
	'utilities/scripting/file-utils',
	'models/packages/package',
	'views/forms/form-view',
], function($, _, Template, FileUtils, Package, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

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

		templateContext: function() {
			return {
				isAtomic: this.model.isAtomic(),
				hasLanguageVersion: this.options.package.hasLanguageVersion()
			};
		},

		onRender: function() {
			var self = this;

			// set default package path
			//
			if (!this.model.has('source_path')) {
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
			}

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// defaults setting methods
		//

		setDefaultPackagePath: function(done) {
			var self = this;

			// fetch package version directory tree
			//
			this.model.fetchRoot({

				// callbacks
				//
				success: function(data) {
					self.model.root = data;
					self.$el.find('#package-path').val(data);

					// perform done callback
					//
					if (done) {
						done();
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch directory tree for this package version."
					});
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

					// show error message
					//
					application.error({
						message: "Could not fetch language for this package version."
					});
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
		// form methods
		//

		getValues: function() {
			return {
				'source_path': this.getPackagePath(),
				'language_version': this.getLanguageVersion()
			};
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
				'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-dialog-view'
			], function (SelectPackageVersionDirectoryDialogView) {

				// show select package version directory dialog
				//
				application.show(new SelectPackageVersionDirectoryDialogView({
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
				});
			});
		},

		onChangeLanguageVersion: function() {
			this.checkLanguageVersion(this.getLanguageVersion());
		},

		onClickShowGemInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-gem-info-dialog-view'
			], function (PackageVersionGemInfoDialogView) {

				// show package version gem info dialog
				//
				application.show(new PackageVersionGemInfoDialogView({
					model: self.model,
					packagePath: self.getPackagePath()
				}), {
					size: 'large'
				});
			});
		}
	});
});
