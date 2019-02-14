/******************************************************************************\
|                                                                              |
|                            python-package-form-view.js                       |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/python/python-package-form.tpl',
	'registry',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-file-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-view'	
], function($, _, Backbone, Marionette, Template, Registry, Accordions, Directory, PackageTypeFormView, SelectPackageVersionFileView, SelectPackageVersionDirectoryView) {
	return PackageTypeFormView.extend({

		//
		// attributes
		//
		
		events: {
			'blur input': 'onBlurInput',
			'focus #build-system select': 'onFocusBuildSystem',
			'change #build-system select': 'onChangeBuildSystem',
			'click #configure-path button': 'onClickConfigurePathButton',
			'click #build-path button': 'onClickBuildPathButton',
			'click #build-file button': 'onClickBuildFileButton'
		},

		buildCommands: {
			'make': 			'make',
			'configure+make':	'make',
			'cmake+make': 		'make', 
			'other': 			undefined
		},

		//
		// setting methods
		//

		setBuildSystem: function(buildSystem) {

			// set selector
			//
			switch (buildSystem) {
				case 'none':
					this.$el.find("#build-system select").val('no-build');
					this.onSetBuildSystem();	
					break;
				case 'distutils':
					this.$el.find("#build-system select").val('distutils');
					this.onSetBuildSystem();
					break;
				case 'python-setuptools':
					this.$el.find("#build-system select").val('python-setuptools');
					this.onSetBuildSystem();
					break;
				case 'wheels':
					this.$el.find("#build-system select").val('wheels');
					this.onSetBuildSystem();
					break;
				case 'other':
					this.$el.find("#build-system select").val('other');
					this.onSetBuildSystem();
					break;
				default:

					// select 'no build' by default
					//
					this.$el.find("#build-system select").val('no-build');
					this.onSetBuildSystem();
					break;			
			}
		},

		setBuildSystemDefaults: function(buildSystem) {

			// set default build command
			//
			var buildCommand = this.buildCommands[buildSystem];
			this.$el.find('#build-command input').val(buildCommand);
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			switch (this.$el.find('#build-system select').val()) {
				case 'no-build':
					return 'none';
				case 'distutils':
					return 'distutils';
				case 'python-setuptools':
					return 'python-setuptools';
				case 'wheels':
					return 'wheels';
				case 'other':
					return 'other';
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'none':
					return 'No Build';
				case 'distutils':
					return 'Build with DistUtils';
				case 'python-setuptools':
					return 'Build with Setuptools';
				case 'wheels':
					return 'Wheels';
				case 'other':
					return 'Build (Other)';
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		hasConfigureSettings: function(buildSystem) {
			var configurePath = this.$el.find('#configure-path input:visible').val();
			var configureCommand = this.$el.find('#configure-command input:visible').val();
			var configureOptions = this.$el.find('#configure-options input:visible').val();
			return configurePath != '' || 
				configureCommand != '' || 
				configureOptions != '';
		},

		hasBuildSettings: function(buildSystem) {
			if (!buildSystem || buildSystem == 'none') {
				return true;
			}

			var buildPath = this.$el.find('#build-path input:visible').val();
			var excludePaths = this.$el.find('#exclude-paths input:visible').val();
			var buildFile = this.$el.find('#build-file input:visible').val();
			var buildOptions = this.$el.find('#build-options input:visible').val();
			var buildTarget = this.getBuildTarget();

			return buildPath != '' || 
				excludePaths != '' || 
				buildFile != '' || 
				buildOptions != '' || 
				buildTarget != '';
		},

		hasExcludePaths: function() {
			return this.$el.find('#exclude_paths input:visible').val() != '';
		},

		getBuildCommand: function(buildSystem) {
			if (buildSystem == 'other') {
				return this.$el.find('#other-build-command input:visible').val();
			} else {
				return this.$el.find('#build-command input:visible').val();
			}
		},

		getBuildTarget: function() {
			return this.$el.find('#build-target input:visible').val();
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

			// set initial build system state
			//
			this.onSetBuildSystem();

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

		//
		// configure settings methods
		//

		showConfigureSettings: function() {
			this.$el.find('.tag[href="#configure-settings"]').show();

			// expand / collapse settings
			//
			if (this.hasConfigureSettings()) {
				this.$el.find('#configure-settings').collapse('show');
			} else {
				this.$el.find('#configure-settings').collapse('hide');
			}
		},

		hideConfigureSettings: function() {
			this.$el.find('.tag[href="#configure-settings"]').hide();
			this.$el.find('#configure-settings').collapse('hide');
		},

		//
		// build settings methods
		//

		showBuildSettings: function() {
			this.$el.find('.tag[href="#build-settings"]').show();

			// expand / collapse settings
			//
			if (this.hasBuildSettings()) {
				this.$el.find('#build-settings').collapse('show');
			} else {
				this.$el.find('#build-settings').collapse('hide');
			}
		},

		hideBuildSettings: function() {
			this.$el.find('.tag[href="#build-settings"]').hide();
			this.$el.find('#build-settings').collapse('hide');
		},

		//
		// build system configuration
		//

		showBuildSystem: function(buildSystem) {

			// expand / collapse build settings
			//
			if (buildSystem != 'wheels') {
				this.showConfigureSettings();
				this.showBuildSettings();
			} else {
				this.hideConfigureSettings();
				this.hideBuildSettings();
			}

			// show / hide build command
			//
			if (buildSystem == 'other') {
				this.$el.find('#other-build-command').show();
				this.$el.find('#build-command').hide();
			} else {
				this.$el.find('#other-build-command').hide();
				this.$el.find('#build-command').show();
			}

			// show / hide build command
			//
			if (buildSystem == 'none') {
				this.$el.find('.build.tag').hide();
				this.$el.find('#build-settings').hide();
			} else {
				this.$el.find('.build.tag').css('display', '');
				this.$el.find('#build-settings').css('display', '');
			}

			// show / hide build settings
			//
			if (buildSystem == 'other') {
				this.$el.find('#build-path').show();
				this.$el.find('#build-file').hide();
				this.$el.find('#build-options').show();
				this.$el.find('#build-target').show();
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
			var buildSystem = this.getBuildSystem();

			return {

				// configuration settings
				//
				'config_dir': this.$el.find('#configure-path input:visible').val(),
				'config_cmd': this.$el.find('#configure-command input:visible').val(),
				'config_opt': this.$el.find('#configure-options input:visible').val(),

				// build system settings
				//
				'build_system': buildSystem,
				'build_cmd': this.getBuildCommand(buildSystem),

				// build settings
				//
				'build_dir': this.$el.find('#build-path input:visible').val(),
				'exclude_paths': this.$el.find('#exclude-paths input:visible').val(),
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

			// set defaults
			//
			this.setBuildSystemDefaults(buildSystem);

			// show / hide build system info
			//
			this.showBuildSystem(buildSystem);

			// show / hide no build notice
			//
			if (buildSystem == 'none') {
				this.options.parent.options.parent.showNotice(this.notices['none']);
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
			if (buildSystem == 'none') {
				this.options.parent.options.parent.showNotice(this.notices['select-none']);
			} else {
				this.options.parent.options.parent.hideNotice();	
			}
			
			// perform callback
			//
			this.onChange();
		},

		onClickConfigurePathButton: function(event) {
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
						self.$el.find('#configure-path input').val(selectedDirectoryName);
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

		onClickBuildPathButton: function(event) {
			var self = this;

			// get paths
			//
			var sourcePath = this.model.get('source_path');
			var buildPath = this.$el.find('#build-path input').val();

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
					title: "Select Build Path",
					selectedDirectoryName: sourceDirectory.getPathTo(buildPath),
					
					// callbacks
					//
					accept: function(selectedDirectoryName) {

						// make path relative to package path
						//
						selectedDirectoryName = sourceDirectory.getRelativePathTo(selectedDirectoryName);

						// set build path input
						//
						self.$el.find('#build-path input').val(selectedDirectoryName);
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
			
		onClickBuildFileButton: function(event) {
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
						self.$el.find('#build-file input').val(selectedFileName);
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
