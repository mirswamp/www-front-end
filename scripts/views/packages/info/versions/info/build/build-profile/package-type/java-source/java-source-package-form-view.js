/******************************************************************************\
|                                                                              |
|                          java-source-package-form-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a package versions's            |
|        language / type specific profile information.                         |
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
	'bootstrap/collapse',
	'bootstrap/dropdown',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'bootstrap.select',
	'jquery.validate',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/java-source/java-source-package-form.tpl',
	'registry',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-file-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-view'
], function($, _, Backbone, Marionette, Collapse, Dropdown, Tooltip, Popover, Select, Validate, Template, Registry, Accordions, Directory, SelectPackageVersionFileView, SelectPackageVersionDirectoryView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//
		
		events: {
			'blur input': 'onBlurInput',
			'focus #build-system': 'onFocusBuildSystem',
			'change #build-system': 'onChangeBuildSystem',
			'click #select-configure-path': 'onClickSelectConfigurePath',
			'click #select-build-path': 'onClickSelectBuildPath',
			'click #select-build-file': 'onClickSelectBuildFile'
		},

		buildCommands: {
			'ant': 				'ant',
			'ant+ivy': 			'ant',
			'maven': 			'mvn',
			'gradle': 			'gradle'
		},

		//
		// message attributes
		//

		noBuildMessage: "This package does not appear to include a build file. You can set the build system and advanced settings if this is not correct. By selecting the no build option, analysis is limited to compilable files located in the package path (nonrecursive).",
		selectNoBuildMessage: "By selecting the no build option, analysis is limited to compilable files located in the package path (nonrecursive).",

		//
		// methods
		//

		initialize: function() {

			// add custom validation rule
			//
			jQuery.validator.addMethod('buildSystemRequired', function (value) {
				return (value != 'none');
			}, "Please specify a build system.");
		},

		//
		// setting methods
		//

		setBuildSystem: function(buildSystem) {

			// set selector
			//
			switch (buildSystem) {
				case 'no-build':
					this.$el.find("#build-system").val('no-build');
					this.onSetBuildSystem();
					break;
				case 'ant':
					this.$el.find("#build-system").val('ant');
					this.onSetBuildSystem();
					break;
				case 'ant+ivy':
					this.$el.find("#build-system").val('ivy');
					this.onSetBuildSystem();
					break;
				case 'maven':
					this.$el.find("#build-system").val('maven');
					this.onSetBuildSystem();
					break;
				case 'gradle':
					this.$el.find("#build-system").val('gradle');
					this.onSetBuildSystem();
					break;
				case 'gradle-wrapper':
					this.$el.find("#build-system").val('gradle');
					this.$el.find("#use-gradle-wrapper").prop("checked", true);
					this.onSetBuildSystem();
					break;
				default:

					// select 'no build' by default
					//
					if (this.hasBuildSystem('no-build')) {
						this.$el.find("#build-system").val('no-build');
						this.onSetBuildSystem();	
					} else {
						this.options.parent.options.parent.showWarning("This package does not appear to use a recognized build system for a Java source package.");
					}
					break;
			}
		},

		//
		// querying methods
		//

		getBuildSystem: function(buildSystem) {
			switch (this.$el.find('#build-system').val()) {
				case 'no-build':
					return 'no-build';
					break;
				case 'ant':
					return 'ant';
					break;
				case 'ivy':
					return 'ant+ivy';
					break;
				case 'maven':
					return 'maven';
					break;
				case 'gradle':
				case 'gradle-wrapper':
					return 'gradle';
					break;
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (this.$el.find('#build-system').val()) {
				case 'ant':
					return 'Ant';
					break;
				case 'ant+ivy':
					return 'Ant + Ivy';
					break;
				case 'maven':
					return 'Maven';
					break;
				case 'gradle':
				case 'gradle-wrapper':
					return 'Gradle';
					break;
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		getBuildTarget: function() {
			return this.$el.find('#build-target').val();
		},

		hasBuildSettings: function(buildSystem) {
			return (buildSystem != 'no-build');
		},

		hasBuildSystemSettings: function(buildSystem) {
			return (buildSystem == 'gradle');
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

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// check build system of package version
			//
			this.options.parent.checkBuildSystem();

			// validate the form
			//
			this.validator = this.validate();
		},

		showAdvancedSettings: function() {
			this.$el.find('#advanced-settings-accordion').show();
		},

		hideAdvancedSettings: function() {
			this.$el.find('#advanced-settings-accordion').hide();
		},

		showBuildSystem: function(buildSystem) {

			// show / hide build system tags
			//
			if (this.hasBuildSystemSettings(buildSystem)) {
				this.$el.find('.build-system.tag').show();
			} else {
				this.$el.find('.build-system.tag').hide();
			}
			
			// show / hide build system settings
			//
			if (buildSystem == 'gradle') {
				this.$el.find('#build-system-settings').removeAttr('style');
			} else {
				this.$el.find('#build-system-settings').hide();
			}

			// show / hide ant info
			//
			if (buildSystem == 'ant') {
				this.$el.find('.ant-settings').removeAttr('style');
				
				// show ant build target
				//
				buildTarget = this.getBuildTarget();
				if (buildTarget != 'release' && buildTarget != 'debug') {
					buildTarget = 'other';
					this.$el.find('#other-build-target').closest('.form-group').show();
				}
				$("#build-target option").each(function() { this.selected = (this.text == buildTarget); });
			} else {
				this.$el.find('.ant-settings').hide();
			}

			// show / hide maven info
			//
			if (buildSystem == 'maven') {
				this.$el.find('.maven-settings').removeAttr('style');

				// show maven build target
				//
				this.$el.find('#other-build-target').closest('.form-group').hide();
			} else {
				this.$el.find('.maven-settings').hide();
			}

			// show / hide gradle info
			//
			if (buildSystem == 'gradle') {
				this.$el.find('.gradle-settings').removeAttr('style');
				
				// show gradle build target
				//
				buildTarget = this.getBuildTarget();
				if (buildTarget != 'compileReleaseSources' && buildTarget != 'compileDebugSources') {
					buildTarget = 'other';
					this.$el.find('#other-build-target').closest('.form-group').show();
				}
				$("#build-target option").each(function() { this.selected = (this.text == buildTarget); });
			} else {
				this.$el.find('.gradle-settings').hide();
			}

			// show / hide other build command
			//
			if (buildSystem === 'other') {
				this.$el.find('#build-cmd-field').closest('.form-group').show();
			} else {
				this.$el.find('#build-cmd-field').closest('.form-group').hide();
			}

			// show build target select or input
			//
			if (buildSystem == 'ant' || buildSystem == 'gradle') {
				this.$el.find('#build-target select').show();
				this.$el.find('#build-target .input-group').hide();
			} else {
				this.$el.find('#build-target select').hide();
				this.$el.find('#build-target .input-group').show();
			}
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'build-system': {
						buildSystemRequired: true
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(model) {

			// build system settings
			//
			var buildSystem = this.getBuildSystem();
			var useGradleWrapper = this.$el.find('#use-gradle-wrapper').prop('checked');

			// configuration settings
			//
			var configurePath = this.$el.find('#configure-path').val();
			var configureCommand = this.$el.find('#configure-command').val();
			var configureOptions = this.$el.find('#configure-options').val();

			// build settings
			//
			var buildPath = this.$el.find('#build-path').val();
			var buildFile = this.$el.find('#build-file').val();
			var buildOptions = this.$el.find('#build-options').val();
			var buildTarget = this.getBuildTarget();

			// set model attributes
			//
			model.set({

				// build system attributes
				//
				'build_system': buildSystem != ''? buildSystem : null,
				'use_gradle_wrapper': useGradleWrapper,
				'build_cmd': null,

				// configuration attributes
				//
				'config_dir': configurePath != ''? configurePath : null,
				'config_cmd': configureCommand != ''? configureCommand : null,
				'config_opt': configureOptions != ''? configureOptions : null,

				// build attributes
				//
				'build_dir': buildPath != ''? buildPath : null,
				'build_file': buildFile != ''? buildFile : null,
				'build_opt': buildOptions != ''? buildOptions : null,
				'build_target': buildTarget != ''? buildTarget : null
			});
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
		},

		onBlurInput: function() {
			this.onChange();
		},

		onFocusBuildSystem: function() {

			// remove empty menu item
			//
			if (this.$el.find("#build-system option[value='none']").length !== 0) {
				this.$el.find("#build-system option[value='none']").remove();
			}
		},
		
		onSetBuildSystem: function() {
			this.onChangeBuildSystem();
		},

		onChangeBuildSystem: function(event) {
			var buildSystem = this.getBuildSystem();
			var hasBuildSettings = this.hasBuildSettings(buildSystem);

			// show / hide advanced settings
			//
			if (hasBuildSettings) {
				this.showAdvancedSettings();
			} else {
				this.hideAdvancedSettings();
			}

			// show / hide build system info
			//
			this.showBuildSystem(buildSystem);

			// show / hide build script
			//
			if (hasBuildSettings) {
				this.options.parent.options.parent.showBuildScript();
			} else {
				this.options.parent.options.parent.hideBuildScript();
			}

			// show / hide no build notice
			//
			if (hasBuildSettings) {
				this.options.parent.options.parent.hideNotice();
			} else {
				if (event) {
					this.options.parent.options.parent.showNotice(this.selectNoBuildMessage);
				} else {
					this.options.parent.options.parent.showNotice(this.noBuildMessage);
				}		
			}

			// perform callback
			//
			this.onChange();
		},

		onClickSelectConfigurePath: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var configurePath = this.$el.find('#configure-path').val();

			// create directories
			//
			var sourceDirectory = new Directory({
				name: sourcePath
			});

			// show select package version directory dialog
			//
			Registry.application.modal.show(
				new SelectPackageVersionDirectoryView({
					model: this.model,
					title: "Select Configure Path",
					selectedDirectoryName: sourcePath + configurePath,
					
					// callbacks
					//
					accept: function(selectedDirectoryName) {

						// make path relative to package path
						//
						selectedDirectoryName = sourceDirectory.getRelativePathTo(selectedDirectoryName);

						// set configure path input
						//
						self.$el.find('#configure-path').val(selectedDirectoryName);
						self.onChange();
					}
				}), {
					size: 'large'
				}
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickSelectBuildPath: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var buildPath = this.$el.find('#build-path').val();

			// create dirctories
			//
			var sourceDirectory = new Directory({
				name: sourcePath
			})

			// show select package version directory dialog
			//
			Registry.application.modal.show(
				new SelectPackageVersionDirectoryView({
					model: this.model,
					title: "Select Build Path",
					selectedDirectoryName: sourceDirectory.getPathTo(buildPath),
					
					// callbacks
					//
					accept: function(selectedDirectoryName) {

						// make path relative to source directory
						//
						selectedDirectoryName = sourceDirectory.getRelativePathTo(selectedDirectoryName);

						// set build path input
						//
						self.$el.find('#build-path').val(selectedDirectoryName);
						self.onChange();
					}
				}), {
					size: 'large'
				}
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		},
			
		onClickSelectBuildFile: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var buildPath = this.$el.find('#build-path').val();
			var buildFile = this.$el.find('#build-file').val();

			// create directories
			//
			var sourceDirectory = new Directory({
				name: sourcePath
			});
			var buildDirectory = new Directory({
				name: sourceDirectory.getPathTo(buildPath)
			});

			// show select package version file dialog
			//
			Registry.application.modal.show(
				new SelectPackageVersionFileView({
					model: this.model,
					title: "Select Build File",
					selectedFileName: buildDirectory.getPathTo(buildFile),
					
					// callbacks
					//
					accept: function(selectedFileName) {

						// make path relative to build directory
						//
						selectedFileName = buildDirectory.getRelativePathTo(selectedFileName);
						
						// set build file input
						//
						self.$el.find('#build-file').val(selectedFileName);
						self.onChange();
					}
				}), {
					size: 'large'
				}
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		}
	});
});
