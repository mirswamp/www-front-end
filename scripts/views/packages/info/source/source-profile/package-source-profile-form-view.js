/******************************************************************************\
|                                                                              |
|                         package-source-profile-form-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a package's source              |
|        information.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'dropdown',
	'select2',
	'validate',
	'tooltip',
	'popover',
	'text!templates/packages/info/source/source-profile/package-source-profile-form.tpl',
	'registry',
	'utilities/scripting/file-utils',
	'models/packages/package',
	'collections/packages/packages',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Dropdown, Select2, Validate, Tooltip, Popover, Template, Registry, FileUtils, Package, Packages, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #select-package-path': 'onClickSelectPackagePath',
			'focus #language-type': 'onFocusLanguageType',
			'change #language-type': 'onChangeLanguageType',
			'click #show-file-types': 'onClickShowFileTypes',
			'change [name="language-version"]': 'onChangeLanguageVersion',
			'click #show-gem-info': 'onClickShowGemInfo',
			'click #show-wheel-info': 'onClickShowWheelInfo',
			'change [name="java-type"]': 'onChangeJavaType',
			'change [name="java-version"]': 'onChangeJavaVersion',
			'click #android-source input': 'onClickAndroidSource',
			'click #android-bytecode input': 'onClickAndroidBytecode',
			'change #python-version': 'onChangePythonVersion',
			'submit': 'onSubmit'
		},

		//
		// methods
		//

		initialize: function() {

			// add custom validation rule
			//
			jQuery.validator.addMethod('languageSelected', function (value) {
				return (value != 'none');
			}, "Please specify the package's programming language.");
		},

		//
		// query methods
		//

		getPackagePath: function() {
			return this.$el.find('#package-path').val();
		},

		getLanguageTypeId: function() {
			return this.$el.find('#language-type')[0].selectedIndex;
		},

		getLanguageType: function() {
			var index = this.getLanguageTypeId();
			var selector = this.$el.find('#language-type')[0];
			return selector.options[index].value;
		},

		getLanguageVersion: function() {
			if (this.getLanguageType() == 'ruby') {
				var version = this.$el.find('select[name=language-version]').val();
				return version != "default"? version : undefined;
			}
		},

		getJavaType: function() {
			return this.$el.find('input:radio[name=java-type]:checked').val();
		},

		getJavaVersion: function() {
			return this.$el.find('input:radio[name=java-version]:checked').val();
		},

		isAndroidSource: function() {
			return this.$el.find('#android-source input:checked').prop('checked');
		},

		isAndroidBytecode: function() {
			return this.$el.find('#android-bytecode input:checked').prop('checked');
		},

		getPythonVersion: function() {
			return this.$el.find('input:radio[name=python-version]:checked').val();
		},

		getRubyType: function() {
			return this.$el.find('input:radio[name=ruby-type]:checked').val();
		},

		getPackageType: function() {
			switch (this.getLanguageType()) {
				case 'c':
					return 'c-source';
					break;
				case 'java':
					switch (this.getJavaType()) {
						case 'java-source':
							if (this.isAndroidSource()) {
								return 'android-source';
							} else {
								switch (this.getJavaVersion()) {
									case 'java7':
										return 'java7-source';
									case 'java8':
										return 'java8-source';
								}
							}
							break;
						case 'java-bytecode':
							if (this.isAndroidBytecode()) {
								return 'android-bytecode';
							} else {
								switch (this.getJavaVersion()) {
									case 'java7':
										return 'java7-bytecode';
									case 'java8':
										return 'java8-bytecode';
								}
							}
							break;
					}
					break;
				case 'python':
					return this.getPythonVersion();
					break;
				case 'ruby':
					return this.getRubyType();
					break;
				case 'web-scripting':
					return 'web-scripting';
					break;
			}
		},

		getWebScriptingTypes: function() {
			var webScriptingTypes = [];
				
			if (this.$el.find('#html input').prop('checked')) {
				webScriptingTypes.push('html');
			}
			if (this.$el.find('#javascript input').prop('checked')) {
				webScriptingTypes.push('javascript');
			}
			if (this.$el.find('#php input').prop('checked')) {
				webScriptingTypes.push('php');
			}
			if (this.$el.find('#css input').prop('checked')) {
				webScriptingTypes.push('css');
			}
			if (this.$el.find('#xml input').prop('checked')) {
				webScriptingTypes.push('xml');
			}

			return webScriptingTypes;
		},

		getPackageLanguage: function() {
			var languageType = this.getLanguageType();
			if (languageType != 'web-scripting') {
				return languageType;
			} else {
				return this.getWebScriptingTypes();
			}
		},

		//
		// attributes setting methods
		//

		setLanguageType: function(languageType) {
			this.onFocusLanguageType();
			this.$el.find("#language-type option[value='" + languageType + "']").prop('selected', true);
			this.onChangeLanguageType();
		},

		setJavaType: function(javaType) {
			switch (javaType) {
				case 'java-source':
					$('input[value=java-source]').attr('checked', 'checked');
					this.onChangeJavaType();
					break;
				case 'java-bytecode':
					$('input[value=java-bytecode]').attr('checked', 'checked');
					this.onChangeJavaType();
					break;
			}
		},

		setJavaVersion: function(javaVersion) {
			switch (javaVersion) {
				case 'java7':
					$('input[value=java7]').attr('checked', 'checked');
					this.onChangeJavaVersion();
					break;
				case 'java8':
					$('input[value=java8]').attr('checked', 'checked');
					this.onChangeJavaVersion();
					break;
			}
		},

		setAndroidSource: function(checked) {
			this.$el.find('#android-source input').prop('checked', checked);

			if (checked) {
				this.$el.find('#java-version').hide();
			} else {
				this.$el.find('#java-version').show();
			}
		},

		setAndroidBytecode: function(checked) {
			this.$el.find('#android-bytecode input').prop('checked', checked);

			if (checked) {
				this.$el.find('#java-version').hide();
			} else {
				this.$el.find('#java-version').show();
			}
		},

		setPythonVersion: function(pythonVersion) {
			switch (pythonVersion) {
				case 'python2':
					$('input[value=python2]').attr('checked', 'checked');
					this.onChangeLanguageType();
					break;
				case 'python3':
					$('input[value=python3]').attr('checked', 'checked');
					this.onChangeLanguageType();
					break;
			}
		},

		setRubyType: function(rubyType) {
			switch (rubyType) {
				case 'ruby':
					$('input[value=ruby]').attr('checked', 'checked');
					this.onChangeLanguageType();
					break;
				case 'sinatra':
					$('input[value=sinatra]').attr('checked', 'checked');
					this.onChangeLanguageType();
					break;
				case 'rails':
					$('input[value=rails]').attr('checked', 'checked');
					this.onChangeLanguageType();
					break;
				case 'padrino':
					$('input[value=padrino]').attr('checked', 'checked');
					this.onChangeLanguageType();
					break;
			}
		},

		setLanguageVersion: function(languageVersion) {
			this.$el.find('#language-version option').each(function() {
				this.selected = (this.text == languageVersion);
			});	
		},

		setWebScriptingTypes: function(fileTypes) {

			// set which scripting types are selected
			//
			if (fileTypes.contains('html') || fileTypes.contains('htm')) {
				this.$el.find('#html input').prop('checked', true);
			}
			if (fileTypes.contains('js')) {
				this.$el.find('#javascript input').prop('checked', true);
			}
			if (fileTypes.contains('php')) {
				this.$el.find('#php input').prop('checked', true);
			}
			if (fileTypes.contains('css')) {
				this.$el.find('#css input').prop('checked', true);
			}
			if (fileTypes.contains('xml')) {
				this.$el.find('#xml input').prop('checked', true);
			}
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

			// display language selector
			//
			this.showLanguageSelector(function(languages, packageTypes) {

				// configure user interface
				//
				if (languages.contains('Java')) {
					self.setJavaTypes(packageTypes);
				}
				if (languages.contains('Ruby')) {
					self.setRubyTypes(packageTypes);
				}
				if (languages.contains('Python')) {
					self.setPythonTypes(packageTypes);
				}
				if (languages.contains('Web Scripting')) {
					// self.setWebScriptingTypes(packageTypes);
				}

				// set defaults for new packages
				//
				if (self.model.isNew()) {
					self.setDefaultPackagePath(function() {
						self.setDefaultPackageType();
					});
				}
			});


			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// unhide show wheel info button
			//
			if (this.model.getFilename().endsWith('whl')) {
				this.$el.find('#show-wheel-info').show();
			}

			// validate the form
			//
			this.validator = this.validate();
		},

		showLanguageSelector: function(done) {
			var self = this;
			
			// fetch supported languages
			//
			Packages.fetchTypes({

				// callbacks
				//
				success: function(packageTypes) {
					var languages = Packages.packageTypesToLanguages(packageTypes);
					var languageSelector = self.$el.find('#language-type');
					for (var i = 0; i < languages.length; i++) {
						var language = languages[i];
						var value = (language != 'C/C++'? language.toLowerCase() : 'c').replace(' ', '-');
						languageSelector.append('<option value="' + value + '">' + language + (self.options.package.getLanguageType() == language? 'selected' : '') + '</option>');
					}

					// apply select2 selector
					//
					//self.$el.find("#language-type").select2();

					// perform callback
					//
					if (done) {
						done(languages, packageTypes);
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch package types."
						})
					);
				}			
			});
		},

		setJavaTypes: function(packageTypes) {
			packageTypeNames = Packages.packageTypesToNames(packageTypes);

			// remove java7 / java8 options
			//
			if (!packageTypeNames.contains('Java 7 Source Code') &&
				!packageTypeNames.contains('Java 7 Bytecode')) {
				this.$el.find('#java7').remove();
			}
			if (!packageTypeNames.contains('Java 8 Source Code') &&
				!packageTypeNames.contains('Java 8 Bytecode')) {
				this.$el.find('#java8').remove();
			}

			// remove java source / bytecode options
			//
			if (!packageTypeNames.contains('Java 7 Source Code') &&
				!packageTypeNames.contains('Java 8 Source Code')) {
				this.$el.find('#java-source').remove();
			}
			if (!packageTypeNames.contains('Java 7 Bytecode') &&
				!packageTypeNames.contains('Java 8 Bytecode')) {
				this.$el.find('#java-bytecode').remove();
			}

			// remove android source option
			//
			if (!packageTypeNames.contains('Android Java Source Code')) {
				this.$el.find('#android-source').remove();
			}

			// remove android bytecode option
			//
			if (!packageTypeNames.contains('Android .apk')) {
				this.$el.find('#android-bytecode').remove();
			}
		},

		setRubyTypes: function(packageTypes) {

			// remove ruby framework options
			//
			if (!packageTypeNames.contains('Ruby')) {
				this.$el.find('#ruby').remove();
			}
			if (!packageTypeNames.contains('Ruby Sinatra')) {
				this.$el.find('#ruby-sinatra').remove();
			}
			if (!packageTypeNames.contains('Ruby on Rails')) {
				this.$el.find('#ruby-rails').remove();
			}
			if (!packageTypeNames.contains('Ruby Padrino')) {
				this.$el.find('#ruby-padrino').remove();
			}
		},

		setPythonTypes: function(packageTypes) {

			// remove python version options
			//
			if (!packageTypeNames.contains('Python2')) {
				this.$el.find('#python2').remove();
			}
			if (!packageTypeNames.contains('Python3')) {
				this.$el.find('#python3').remove();
			}
		},

		showAndroidSource: function() {
			this.$el.find('#android-source').show();
		},

		hideAndroidSource: function() {
			this.$el.find('#android-source').hide();
		},

		showAndroidBytecode: function() {
			this.$el.find('#android-bytecode').show();
		},

		hideAndroidBytecode: function() {
			this.$el.find('#android-bytecode').hide();
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
					'dirname': this.$el.find('#package-path').val()
				},

				// callbacks
				//
				success: function(packageTypes, languageVersions, fileTypes) {
					self.defaultPackageTypes = packageTypes;

					switch (packageTypes[0]) {

						// C/C++ package types
						//
						case 'c-source':
							self.setLanguageType('c');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;

						// java package types
						//
						case 'java-source':
						case 'java7-source':
							self.setLanguageType('java');
							self.setJavaType('java-source');
							self.setJavaVersion('java7');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							self.setDefaultAndroidSourceSetting();
							break;

						case 'java8-source':
							self.setLanguageType('java');
							self.setJavaType('java-source');
							self.setJavaVersion('java8');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							self.setDefaultAndroidSourceSetting();
							break;

						case 'java-bytecode':
						case 'java7-bytecode':
							self.setLanguageType('java');
							self.setJavaType('java-bytecode');
							self.setJavaVersion('java7');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							self.setDefaultAndroidBytecodeSetting();
							break;

						case 'java8-bytecode':
							self.setLanguageType('java');
							self.setJavaType('java-bytecode');
							self.setJavaVersion('java8');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							self.setDefaultAndroidBytecodeSetting();
							break;

						// android package types
						//
						case 'android-bytecode':
							self.setLanguageType('java');
							self.setJavaType('java-bytecode');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							self.setAndroidBytecode(true);
							break;

						// python package types
						//
						case 'python':
						case 'python2':
							self.setLanguageType('python');
							self.setPythonVersion('python2');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;
						case 'python3':
							self.setLanguageType('python');
							self.setPythonVersion('python3');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;

						// ruby package types
						//
						case 'ruby':
							self.setLanguageType('ruby');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;
						case 'sinatra':
							self.setLanguageType('ruby');
							self.setRubyType('sinatra');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;
						case 'rails':
							self.setLanguageType('ruby');
							self.setRubyType('rails');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;
						case 'padrino':
							self.setLanguageType('ruby');
							self.setRubyType('padrino');
							self.options.parent.showNotice("This appears to be a " + Package.packageTypesToString(packageTypes) + " package. You can set the language type if this is not correct. ");
							break;
						default:
							self.options.parent.showWarning("This does not appear to be a package written in one of the allowed programming language types. ");
							self.options.parent.hideNotice();
							break;

						// web package types
						//
						case 'web-scripting':
							self.setLanguageType('web-scripting');
							self.setWebScriptingTypes(fileTypes);
							break;
					}
					self.onChangeLanguageType();

					// set language version
					//
					if (languageVersions && languageVersions[0]) {
						self.defaultLanguageVersion = languageVersions[0];
						self.setLanguageVersion(languageVersions[0]);
					}

					// check for android types
					//
					if (packageTypes[0] == 'java7-source' || packageTypes[0] == 'java8-source') {
						self.checkForFile('AndroidManifest.xml', {
							recursive: true,

							// callbacks
							//
							success: function(data) {
								self.setAndroidSource(data);
							}
						});
					} else if (packageTypes[0] == 'java7-bytecode' || packageTypes[0] == 'java8-bytecode' ) {
						self.checkForFile('AndroidManifest.xml', {
							recursive: true,

							// callbacks
							//
							success: function(data) {
								self.setAndroidBytecode(data);
							}
						});
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

		setDefaultAndroidSourceSetting: function() {
			var self = this;
			var filename = 'AndroidManifest.xml';

			this.checkForFile(filename, {
				recursive: true,
				
				// callbacks
				//
				success: function(data) {
					self.setAndroidSource(data);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not check package version for file '" + filename + "'."
						})
					);	
				}
			});
		},

		setDefaultAndroidBytecodeSetting: function() {
			var self = this;
			var filename = 'AndroidManifest.xml';

			this.checkForFile(filename, {
				recursive: true,
				
				// callbacks
				//
				success: function(data) {
					self.setAndroidBytecode(data);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not check package version for file '" + filename + "'."
						})
					);	
				}
			});
		},

		checkForFile: function(filename, options) {
			this.model.fetchContents(filename, this.$el.find('#package-path').val(), options);
		},

		//
		// form validation methods
		//

		isValid: function() {
			return this.validator.form();
		},

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'package-path': {
						required: true					
					},
					'language-type': {
						languageSelected: true
					}
				}
			});
		},

		//
		// form methods
		//

		update: function(package, packageVersion) {

			// update package
			//
			package.set({
				'package_type_id': Package.toPackageTypeId(this.getPackageType()),
				'package_language': this.getPackageLanguage()
			});

			// update package version
			//
			packageVersion.set({
				'source_path': this.getPackagePath(),
				'language_version': this.getLanguageVersion()
			});
		},

		//
		// checking methods
		//

		checkAndroidSource: function() {
			var self = this;
			var filename = 'AndroidManifest.xml';

			this.checkForFile(filename, {
				recursive: true,

				// callbacks
				//
				success: function(data) {
					if (!data) {
						self.options.parent.showWarning("This package does not appear to contain the file '" + filename + "'.");
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not check package version for file '" + filename + "'."
						})
					);	
				}
			});
		},

		checkAndroidBytecode: function() {
			var self = this;
			var filename = 'AndroidManifest.xml';

			this.checkForFile(filename, {
				recursive: true,

				// callbacks
				//
				success: function(data) {
					if (!data) {
						self.options.parent.showWarning("This package does not appear to contain the file '" + filename + "'.");
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not check package version for file '" + filename + "'."
						})
					);	
				}
			});
		},

		checkPackageType: function(packageType) {

			// check android bytecode (.apk) files
			//
			if (packageType == 'android-bytecode') {
				if (!this.model.getFilename().endsWith('.apk')) {
					this.options.parent.showWarning("This package does not appear to be a .apk file.");
					return false;
				} else {
					this.options.parent.hideWarning();
					return true;
				}
			}

			// check specified package type against list of inferred package types
			//
			if ((this.defaultPackageTypes.indexOf(packageType) == -1) &&
				(this.defaultPackageTypes.indexOf(Package.getTypeAlias(packageType)) == -1)) {
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
					this.options.parent.showNotice('The selected language version does not match the version specified in the package.');
				} else {
					this.options.parent.hideNotice();
				}
			}
		},

		//
		// event handling methods
		//

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
						
							// reset default package type
							//
							self.setDefaultPackageType();
						}
					}), {
						size: 'large'
					}
				);
			});
		},

		onFocusLanguageType: function() {

			// remove empty menu item
			//
			if (this.$el.find("#language-type option[value='none']").length !== 0) {
				this.$el.find("#language-type option[value='none']").remove();
			}
		},

		onChangeLanguageType: function() {

			// check that package contains correct file types for package type
			//
			var packageType = this.getPackageType();
			if (packageType) {
				if (!this.checkPackageType(packageType)) {
					this.options.parent.hideNotice();
				};
			}

			// show / hide java type
			//
			if (this.getLanguageType() == 'java') {
				this.$el.find('#java-type').show();
				switch (this.getJavaType()) {
					case 'java-source':
						this.showAndroidSource();
						this.hideAndroidBytecode();
						break;
					case 'java-bytecode':
						this.showAndroidBytecode();
						this.hideAndroidSource();
						break;
				}
			} else {
				this.$el.find('#java-type').hide();
			}

			// hide / show Java version
			//
			if (packageType == 'android-source' || packageType == 'android-bytecode') {
				this.$el.find('#java-version').hide();
			} else {
				this.$el.find('#java-version').show();
			}

			// show / hide ruby versions
			//
			if (this.getLanguageType() == 'ruby') {
				this.$el.find('#language-version').show();
			} else {
				this.$el.find('#language-version').hide();
			}

			// show / hide python type
			//
			if (this.getLanguageType() == 'python') {
				this.$el.find('#python-version').show();
			} else {
				this.$el.find('#python-version').hide();
			}

			// show / hide ruby type
			//
			if (this.getLanguageType() == 'ruby') {
				this.$el.find('#ruby-type').show();
			} else {
				this.$el.find('#ruby-type').hide();
			}

			// show / hide web scripting type
			//
			if (this.getLanguageType() == 'web-scripting') {
				this.$el.find('#web-scripting-type').show();
			} else {
				this.$el.find('#web-scripting-type').hide();
			}
		},

		onClickShowFileTypes: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-file-types-view'
			], function (PackageVersionFileTypesView) {

				// show package version file types dialog
				//
				Registry.application.modal.show(
					new PackageVersionFileTypesView({
						model: self.model,
						packagePath: self.$el.find('#package-path').val()
					})
				);
			});
		},

		onChangeLanguageVersion: function() {

			// check selected language version against the default
			//
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
						packagePath: self.$el.find('#package-path').val()
					}), {
						size: 'large'
					}
				);
			});
		},

		onClickShowWheelInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-wheel-info-view'
			], function (PackageVersionWheelInfoView) {
				var path = self.$el.find('#package-path').val();
				var dirname = self.model.getWheelDirname();

				// strip off trailing slash of path
				//
				if (path.endsWith('/')) {
					path = path.substring(0, path.length - 1);
				}

				// show package version wheel info dialog
				//
				Registry.application.modal.show(
					new PackageVersionWheelInfoView({
						model: self.model,
						dirname: path + "/" + dirname
					})
				);
			});
		},

		onChangeJavaType: function() {
			this.options.parent.hideNotice();
			this.options.parent.hideWarning();	
			var packageType = this.getPackageType();

			// hide / show android option
			//
			var javaType = this.getJavaType();
			switch (javaType) {
				case 'java-source':
					this.showAndroidSource();
					this.hideAndroidBytecode();
					this.setDefaultAndroidSourceSetting();
					break;
				case 'java-bytecode':
					this.showAndroidBytecode();
					this.hideAndroidSource();
					if (!this.model.getFilename().endsWith('.apk')) {
						this.setDefaultAndroidBytecodeSetting();
					}
					break;
			}

			// handle package type aliases
			//
			if (packageType == 'java8-source') {
				packageType = 'java7-source';
			}
			if (packageType == 'android-source') {
				packageType = 'java7-source';
			}
			if (packageType == 'android-bytecode') {
				if (!this.model.getFilename().endsWith('.apk')) {
					this.options.parent.showWarning("This package does not appear to be a .apk file.");
					return false;
				} else {
					this.options.parent.hideWarning();
					return true;
				}
			}

			// check specified package type against list of inferred package types
			//
			if (this.defaultPackageTypes.indexOf(Package.getTypeAlias(packageType)) == -1) {
				this.options.parent.showWarning("This package does not appear to contain the right type of files for a " + Package.packageTypeToName(packageType) + " package.");
			}
		},

		onChangeJavaVersion: function() {
			this.onChangeJavaType();
		},

		onClickAndroidSource: function(event) {

			// check for android source files
			//
			if (this.isAndroidSource()) {
				this.checkAndroidSource();
				this.$el.find('#java-version').hide();
			} else {
				this.$el.find('#java-version').show();

				// check java warnings
				//
				this.checkPackageType(this.getPackageType());
			}
		},

		onClickAndroidBytecode: function() {

			// check for android bytecode files
			//
			if (this.isAndroidBytecode()) {
				var filename = this.model.getFilename();
				if (!filename.endsWith('.apk')) {
					this.options.parent.showWarning("This package does not have the right file extension for a .APK file. ");
				} else {
					this.options.parent.hideWarning();
				}
				this.$el.find('#java-version').hide();
			} else {
				this.$el.find('#java-version').show();
				
				// check java warnings
				//
				this.checkPackageType(this.getPackageType());
			}
		},

		onChangePythonVersion: function() {

			// do nothing - can't tell the difference between python2 and python2 packages
			//		
		}
	});
});
