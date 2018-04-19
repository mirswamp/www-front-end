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
	'text!templates/packages/info/versions/info/build/build-profile/package-type/python/python-package-form.tpl',
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
			'make': 			'make',
			'configure+make':	'make',
			'cmake+make': 		'make', 
			'other': 			undefined
		},

		//
		// message attributes
		//

		noBuildMessage: "This package does not appear to include a build file. You can set the build system and advanced settings if this is not correct. By selecting the no build option, no configuration or build steps will be performed prior to assessment of files in the package path (recursive).",
		selectNoBuildMessage: "By selecting the no build option, no configuration or build steps will be performed prior to assessment of files in the package path (recursive).",

		//
		// methods
		//

		initialize: function() {
			var self = this;
			
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
				case 'none':
					this.$el.find("#build-system").val('no-build');
					this.onSetBuildSystem();	
					break;
				case 'distutils':
					this.$el.find("#build-system").val('distutils');
					this.onSetBuildSystem();
					break;
				case 'python-setuptools':
					this.$el.find("#build-system").val('python-setuptools');
					this.onSetBuildSystem();
					break;
				case 'wheels':
					this.$el.find("#build-system").val('wheels');
					this.onSetBuildSystem();
					break;
				case 'other':
					this.$el.find("#build-system").val('other');
					this.onSetBuildSystem();
					break;
				default:

					// select 'no build' by default
					//
					this.$el.find("#build-system").val('no-build');
					this.onSetBuildSystem();
					break;			
			}
		},

		setBuildSystemDefaults: function(buildSystem) {

			// set default build command
			//
			var buildCommand = this.buildCommands[buildSystem];
			this.$el.find('#build-command').val(buildCommand);
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			switch (this.$el.find('#build-system').val()) {
				case 'no-build':
					return 'none';
					break;
				case 'distutils':
					return 'distutils';
					break;
				case 'python-setuptools':
					return 'python-setuptools';
					break;
				case 'wheels':
					return 'wheels';
					break;
				case 'other':
					return 'other';
					break;
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'none':
					return 'No Build';
					break;
				case 'distutils':
					return 'Build with DistUtils';
					break;
				case 'python-setuptools':
					return 'Build with Setuptools';
					break;
				case 'wheels':
					return 'Wheels';
					break;
				case 'other':
					return 'Build (Other)';
					break;			
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		hasConfigureSettings: function(buildSystem) {
			var configurePath = this.$el.find('#configure-path').val();
			var configureCommand = this.$el.find('#configure-command').val();
			var configureOptions = this.$el.find('#configure-options').val();
			return configurePath != '' || 
				configureCommand != '' || 
				configureOptions != '';
		},

		hasBuildSettings: function(buildSystem) {
			//return (buildSystem != 'no-build') && (buildSystem != 'none');
			var buildPath = this.$el.find('#build-path').val();
			var excludePaths = this.$el.find('#exclude-paths').val();
			var buildFile = this.$el.find('#build-file').val();
			var buildOptions = this.$el.find('#build-options').val();
			var buildTarget = this.getBuildTarget();
			return buildPath != '' || 
				excludePaths != '' || 
				buildFile != '' || 
				buildOptions != '' || 
				buildTarget != '';
		},

		hasExcludePaths: function() {
			return this.$el.find('#exclude_paths').val() != '';
		},

		getBuildCommand: function(buildSystem) {
			if (buildSystem == 'other') {
				return this.$el.find('#other-build-command').val();
			} else {
				return this.$el.find('#build-command').val();
			}
		},

		getBuildTarget: function() {
			return this.$el.find('#build-target input').val();
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
			if (buildSystem && buildSystem != 'none') {
				this.showConfigureSettings();
				this.showBuildSettings();
			} else {
				this.hideConfigureSettings();
				this.hideBuildSettings();
			}
			
			// show appropriate fields
			//
			if (buildSystem == 'other') {
				this.$el.find('#other-build-command').closest('.form-group').show();
				this.$el.find('#build-command').closest('.form-group').hide();
				this.$el.find('#build-file').closest('.form-group').hide();
			} else {
				this.$el.find('#other-build-command').closest('.form-group').hide();
				this.$el.find('#build-command').closest('.form-group').show();
				this.$el.find('#build-file').closest('.form-group').show();
			}
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({

				// don't ignore hidden fields
				//
				ignore: [],
				
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
			var buildCommand = this.getBuildCommand(buildSystem);

			// configuration settings
			//
			var configurePath = this.$el.find('#configure-path').val();
			var configureCommand = this.$el.find('#configure-command').val();
			var configureOptions = this.$el.find('#configure-options').val();

			// build settings
			//
			var buildPath = this.$el.find('#build-path').val();
			var excludePaths = this.$el.find('#exclude-paths').val();
			var buildFile = this.$el.find('#build-file').val();
			var buildOptions = this.$el.find('#build-options').val();
			var buildTarget = this.getBuildTarget();

			// set model attributes
			//
			model.set({

				// build system attributes
				//
				'build_system': buildSystem != ''? buildSystem : null,
				'build_cmd': buildCommand != ''? buildCommand : null,

				// configuration attributes
				//
				'config_dir': configurePath != ''? configurePath : null,
				'config_cmd': configureCommand != ''? configureCommand : null,
				'config_opt': configureOptions != ''? configureOptions : null,

				// build attributes
				//
				'build_dir': buildPath != ''? buildPath : null,
				'exclude_paths': excludePaths != ''? excludePaths : null,
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

			// set defaults
			//
			this.setBuildSystemDefaults(buildSystem);
			var hasBuildSettings = this.hasBuildSettings(buildSystem);

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
