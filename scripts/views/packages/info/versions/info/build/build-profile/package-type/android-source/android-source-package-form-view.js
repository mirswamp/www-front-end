/******************************************************************************\
|                                                                              |
|                      android-source-package-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a package versions's                 |
|        language / type specific profile info.                                |
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
	'text!templates/packages/info/versions/info/build/build-profile/package-type/android-source/android-source-package-form.tpl',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-file-dialog-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-dialog-view'
], function($, _, Template, Accordions, Directory, PackageTypeFormView, SelectPackageVersionFileDialogView, SelectPackageVersionDirectoryDialogView) {
	return PackageTypeFormView.extend({

		//
		// attributes
		//
		
		template: _.template(Template),

		events: {
			'blur input': 'onBlurInput',
			'focus #build-system select': 'onFocusBuildSystem',
			'change #build-system select': 'onChangeBuildSystem',
			'change #build-target select': 'onChangeBuildTarget',
			'click #select-configure-path': 'onClickSelectConfigurePath',
			'click #select-build-path': 'onClickSelectBuildPath',
			'click #select-build-file': 'onClickSelectBuildFile'
		},

		buildCommands: {
			'ant': 			'ant',
			'maven': 		'maven',
			'gradle': 		'gradle'
		},

		//
		// methods
		//

		checkForGradleWrapper: function(done) {
			var self = this;
			var filename = 'gradlew';
			var dirname = this.model.get('source_path');

			this.model.fetchContents(filename, dirname, {
				data: {
					recursive: false
				},

				// callbacks
				//
				success: function(found) {
					done(found);
				}, 

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not search package version for gradlew."
					});
				}
			});
		},

		//
		// setting methods
		//

		setBuildSystem: function(buildSystem) {

			// set selector
			//
			switch (buildSystem) {
				case 'no-build':
					this.$el.find("#build-system select").val('no-build');
					this.onSetBuildSystem();
					break;
				case 'android+ant':
					this.$el.find("#build-system select").val('ant');
					this.onSetBuildSystem();
					break;
				case 'android+maven':
					this.$el.find("#build-system select").val('maven');
					this.onSetBuildSystem();
					break;
				case 'android+gradle':
					this.$el.find("#build-system select").val('gradle');
					this.onSetBuildSystem();
					break;
				case 'android+gradle-wrapper':
					this.$el.find("#build-system select").val('gradle');
					this.$el.find("#use-gradle-wrapper input").prop("checked", true);
					this.onSetBuildSystem();
					break;
				default:

					// select 'no build' by default
					//
					if (this.hasBuildSystem('no-build')) {
						this.$el.find("#build-system select").val('no-build');	
					} else {
						this.options.parent.options.parent.showWarning("This package does not appear to use a recognized build system for a Java source package.");
					}
					this.onSetBuildSystem();
					break;
			}
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			switch (this.$el.find('#build-system select').val()) {
				case 'no-build':
					return 'no-build';
				case 'ant':
					return 'android+ant';
				case 'maven':
					return 'android+maven';
				case 'gradle':
					return 'android+gradle';
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'android+ant':
					return 'Ant';
				case 'android+maven':
					return 'Maven';
				case 'android+gradle':
					return 'Gradle';
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		getBuildTarget: function() {
			var buildSystem = this.getBuildSystem();
			var buildTarget;

			switch (buildSystem) {
				case 'android+ant':
				case 'android+gradle':
					buildTarget = this.$el.find('#build-target select').val();
					if (buildTarget == 'other') {
						buildTarget = this.$el.find('#other-build-target input:visible').val();
					}
					break;

				case 'android+maven':
					buildTarget = this.$el.find('#build-target input:visible').val();
					break;
			}

			return buildTarget;
		},

		hasBuildSystemSettings: function(buildSystem) {
			return (buildSystem == 'android+maven') || (buildSystem == 'android+gradle');
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

			// set initial build system state
			//
			this.onSetBuildSystem();
			
			// check for gradle wrapper
			//
			if (this.model.isNew()) {
				this.checkForGradleWrapper(function(found) {
					if (found) {
						self.$el.find("#use-gradle-wrapper").prop("checked", true);
					}
				});
			}

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// check build system of package version
			//
			this.options.parent.checkBuildSystem();

			// call superclass method
			//
			PackageTypeFormView.prototype.onRender.call(this);
		},

		showAdvancedSettings: function() {
			this.$el.find('#advanced-settings').show();
		},

		hideAdvancedSettings: function() {
			this.$el.find('#advanced-settings').hide();
		},

		showBuildSystem: function(buildSystem) {

			// show / hide build system tags
			//
			if (this.hasBuildSystemSettings(buildSystem)) {
				this.$el.find('.build-system.tag').removeAttr('style');
			} else {
				this.$el.find('.build-system.tag').hide();
			}

			// show / hide build system settings
			//
			if (buildSystem == 'android+maven' || buildSystem == 'android+gradle') {
				this.$el.find('#build-system-settings').removeAttr('style');
			} else {
				this.$el.find('#build-system-settings').hide();
			}

			// show / hide ant info
			//
			if (buildSystem == 'android+ant') {
				this.$el.find('.ant-settings').removeAttr('style');
				
				// show ant build target
				//
				buildTarget = this.getBuildTarget();
				if (buildTarget == 'other') {
					this.$el.find('#other-build-target').show();
				}
				$("#build-target option").each(function() {
					this.selected = (this.text == buildTarget);
				});
			} else {
				this.$el.find('.ant-settings').hide();
			}

			// show / hide maven info
			//
			if (buildSystem == 'android+maven') {
				this.$el.find('.maven-settings').removeAttr('style');

				// show maven build target
				//
				this.$el.find('#other-build-target').hide();
			} else {
				this.$el.find('.maven-settings').hide();
			}

			// show / hide gradle info
			//
			if (buildSystem == 'android+gradle') {
				this.$el.find('.gradle-settings').removeAttr('style');
				
				// show gradle build target
				//
				buildTarget = this.getBuildTarget();
				if (!buildTarget || buildTarget == '') {
					buildTarget = 'compileReleaseSources';
				}
				if (buildTarget != 'compileReleaseSources' && buildTarget != 'compileDebugSources') {
					buildTarget = 'other';
					this.$el.find('#other-build-target').show();
				}
				$("#build-target option").each(function() {
					this.selected = (this.text == buildTarget);
				});
			} else {
				this.$el.find('.gradle-settings').hide();
			}

			// show build target select or input
			//
			if (buildSystem == 'android+ant' || buildSystem == 'android+gradle') {
				this.$el.find('#build-target select').show();
				this.$el.find('#build-target .input-group').hide();
			} else {
				this.$el.find('#build-target select').hide();
				this.$el.find('#build-target .input-group').css('display', '');
			}
		},

		//
		// form validation methods
		//

		getValues: function() {
			var buildSystem = this.getBuildSystem();

			// set model attributes
			//
			return {

				// build system attributes
				//
				'build_system': buildSystem,
				'build_cmd': null,
				'maven_version': buildSystem == 'android+maven'? this.$el.find('#maven-version input:visible').val() : undefined,
				'use_gradle_wrapper': buildSystem == 'android+gradle'? this.$el.find('#use-gradle-wrapper input:visible').prop('checked') : undefined,

				// android settings
				//
				'android_sdk_target': this.$el.find('#android-sdk-target input:visible').val(),
				'android_lint_target': this.$el.find('#android-lint-target input:visible').val(),
				'android_redo_build': buildSystem == 'android+ant'? this.$el.find('#android-redo-build input:visible').prop('checked') : undefined,
				'android_maven_plugin': buildSystem == 'android+maven'? this.$el.find('#android-maven-plugin input:visible').val() : undefined,
				
				// configuration attributes
				//
				'config_dir': this.$el.find('#configure-path input:visible').val(),
				'config_cmd': this.$el.find('#configure-command input:visible').val(),
				'config_opt': this.$el.find('#configure-options input:visible').val(),

				// build attributes
				//
				'build_dir': this.$el.find('#build-path input:visible').val(),
				'build_file': this.$el.find('#build-file input:visible').val(),
				'build_opt': this.$el.find('#build-options input').val(),
				'build_target': this.getBuildTarget()
			};	
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
			this.$el.find("#build-system option:empty").remove();
		},

		onSetBuildSystem: function() {
			var buildSystem = this.getBuildSystem();

			// set build system selector defaults
			//
			switch (buildSystem) {
				case 'android+ant':
					this.$el.find('#build-target select').val('release');
					break;
				case 'android+gradle':
					this.$el.find('#build-target select').val('compileReleaseSources');
					break;
			}

			// show / hide build system info
			//
			this.showBuildSystem(buildSystem);

			// show / hide notice
			//
			if (buildSystem == 'no-build') {
				this.options.parent.options.parent.showNotice(this.notices['no-build']);		
			} else if (buildSystem == 'none') {
				this.options.parent.options.parent.showNotice(this.notices.none);
			} else {
				this.options.parent.options.parent.hideNotice();
			}
		},

		onChangeBuildSystem: function() {
			var buildSystem = this.getBuildSystem();

			// update build system state
			//
			this.onSetBuildSystem();

			// show / hide notice
			//
			if (buildSystem == 'no-build') {
				this.options.parent.options.parent.showNotice(this.notices['select-no-build']);		
			} else if (buildSystem == 'none') {
				this.options.parent.options.parent.showNotice(this.notices['select-none']);
			} else {
				this.options.parent.options.parent.hideNotice();
			}

			// clear errors
			//
			this.$el.find('#build-target-error').remove();
			this.$el.find('#other-build-target-error').remove();
			this.$el.find('.error').removeClass('error');

			// perform callback
			//
			this.onChange();
		},

		onChangeBuildTarget: function() {
			var buildTarget = this.$el.find('#build-target select').val();

			// show / hide other build target input field
			//
			if (buildTarget == 'other') {
				this.$el.find('#other-build-target').show();
			} else {
				this.$el.find('#other-build-target').hide();
			}
		},

		onClickSelectConfigurePath: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var configurePath = this.$el.find('#configure-path input').val();

			// create directories
			//
			var sourceDirectory = new Directory({
				name: sourcePath
			});

			// show select package version directory dialog
			//
			application.show(new SelectPackageVersionDirectoryDialogView({
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
					self.$el.find('#configure-path input').val(selectedDirectoryName);
					self.onChange();
				}
			}), {
				size: 'large'
			});

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		},
		
		onClickSelectBuildPath: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var buildPath = this.$el.find('#build-path input').val();

			// create dirctories
			//
			var sourceDirectory = new Directory({
				name: sourcePath
			});

			// show select package version directory dialog
			//
			application.show(new SelectPackageVersionDirectoryDialogView({
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
					self.$el.find('#build-path input').val(selectedDirectoryName);
					self.onChange();
				}
			}), {
				size: 'large'
			});

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		},
			
		onClickSelectBuildFile: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var buildPath = this.$el.find('#build-path input').val();
			var buildFile = this.$el.find('#build-file input').val();

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
			application.show(new SelectPackageVersionFileDialogView({
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
					self.$el.find('#build-file input').val(selectedFileName);
					self.onChange();
				}
			}), {
				size: 'large'
			});

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		}
	});
});
