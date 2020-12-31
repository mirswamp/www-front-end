/******************************************************************************\
|                                                                              |
|                       java-source-package-form-view.js                       |
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
	'text!templates/packages/info/versions/info/build/build-profile/package-type/java-source/java-source-package-form.tpl',
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
					this.$el.find("#use-gradle-wrapper input").prop("checked", true);
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
			switch (this.$el.find('#build-system select').val()) {
				case 'no-build':
					return 'no-build';
				case 'ant':
					return 'ant';
				case 'ivy':
					return 'ant+ivy';
				case 'maven':
					return 'maven';
				case 'gradle':
				case 'gradle-wrapper':
					return 'gradle';
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (this.$el.find('#build-system select').val()) {
				case 'ant':
					return 'Ant';
				case 'ant+ivy':
					return 'Ant + Ivy';
				case 'maven':
					return 'Maven';
				case 'gradle':
				case 'gradle-wrapper':
					return 'Gradle';
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		getBuildTarget: function() {
			return this.$el.find('#build-target input:visible').val();
		},

		hasBuildSystemSettings: function(buildSystem) {
			return (buildSystem == 'gradle');
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

			// set initial build system state
			//
			this.onSetBuildSystem();

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
			if (this.hasBuildSystemSettings(buildSystem)) {
				this.$el.find('#build-system-settings').removeAttr('style');
			} else {
				this.$el.find('#build-system-settings').hide();
			}

			// show / hide build settings
			//
			if (!buildSystem || buildSystem == 'no-build') {
				this.$el.find('#build-path').show();
				this.$el.find('#build-file').hide();
				this.$el.find('#build-options').hide();
				this.$el.find('#build-target').hide();
			} else {
				this.$el.find('#build-path').show();
				this.$el.find('#build-file').show();
				this.$el.find('#build-options').show();
				this.$el.find('#build-target').show();
			}
		},

		//
		// form methods
		//

		getValues: function() {
			return {

				// build system attributes
				//
				'build_system': this.getBuildSystem(),
				'use_gradle_wrapper': this.$el.find('#use-gradle-wrapper input:visible').prop('checked'),
				'build_cmd': null,

				// configuration attributes
				//
				'config_dir': this.$el.find('#configure-path input:visible').val(),
				'config_cmd': this.$el.find('#configure-command input:visible').val(),
				'config_opt': this.$el.find('#configure-options input:visible').val(),

				// build attributes
				//
				'build_dir': this.$el.find('#build-path input:visible').val(),
				'build_file': this.$el.find('#build-file input:visible').val(),
				'build_opt': this.$el.find('#build-options input:visible').val(),
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

			// show / hide build system info
			//
			this.showBuildSystem(buildSystem);

			// show / hide no build notice
			//
			if (buildSystem == 'no-build') {
				this.options.parent.options.parent.showNotice(this.notices['no-build']);		
			} else {
				this.options.parent.options.parent.hideNotice();
			}
		},

		onChangeBuildSystem: function() {
			var buildSystem = this.getBuildSystem();

			// update build system state
			//
			this.onSetBuildSystem();

			// show / hide no build notice
			//
			if (buildSystem == 'no-build') {
				this.options.parent.options.parent.showNotice(this.notices['select-no-build']);
			} else {
				this.options.parent.options.parent.hideNotice();
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
