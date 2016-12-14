/******************************************************************************\
|                                                                              |
|                             ruby-package-form-view.js                        |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'collapse',
	'dropdown',
	'select',
	'tooltip',
	'popover',
	'validate',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package-form.tpl',
	'registry',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-file-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-view'	
], function($, _, Backbone, Marionette, Collapse, Dropdown, Select, Tooltip, Popover, Validate, Template, Registry, Accordions, Directory, SelectPackageVersionFileView, SelectPackageVersionDirectoryView) {
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
			'bundler': 			"bundle install", 
			'bundler+rake': 	"bundle exec rake", 
			'bundler+other': 	undefined,
			'rake':				'rake',
			'other': 			undefined,
			'no-build': 		undefined, 
			'ruby-gem':  		'gem'
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
				case 'bundler':
					this.$el.find("#build-system").val('bundler');
					this.onSetBuildSystem();	
					break;
				case 'bundler+rake':
					this.$el.find("#build-system").val('bundler-rake');
					this.onSetBuildSystem();	
					break;
				case 'bundler+other':
					this.$el.find("#build-system").val('bundler-other');
					this.onSetBuildSystem();	
					break;
				case 'rake':
					this.$el.find("#build-system").val('rake');
					this.onSetBuildSystem();	
					break;
				case 'other':
					this.$el.find("#build-system").val('other');
					this.onSetBuildSystem();	
					break;
				case 'no-build':
					this.$el.find("#build-system").val('no-build');
					this.onSetBuildSystem();	
					break;
				case 'ruby-gem':
					this.$el.find("#build-system").val('ruby-gem');
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

			// set default build file
			//
			switch (buildSystem) {
				case 'distutils':
					this.$el.find('#build-file').val('setup.py');
					break;
				default:
					this.$el.find('#build-file').val('');
					break;
			}

			// set default build command
			//
			var buildCommand = this.buildCommands[buildSystem];
			this.$el.find('#build-command').val(buildCommand);

			// set default build target
			//
			switch (buildSystem) {
				case 'distutils':
					this.$el.find('#build-target').val('build');
					break;
				default:
					this.$el.find('#build-target').val('');
					break;
			}
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			switch (this.$el.find('#build-system').val()) {
				case 'bundler':
					return 'bundler';
					break;
				case 'bundler-rake':
					return 'bundler+rake';
					break;
				case 'bundler-other':
					return 'bundler+other';
					break;
				case 'rake':
					return 'rake';
					break;
				case 'other':
					return 'other';
					break;
				case 'no-build':
					return 'no-build';
					break;
				case 'ruby-gem':
					return 'ruby-gem';
					break;
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'bundler':
					return 'Bundler';
					break;
				case 'bundler+rake':
					return 'Bundler + Rake';
					break;
				case 'bundler+other':
					return 'Bundler + Other';
					break;
				case 'rake':
					return 'Rake';
					break;
				case 'other':
					return 'Build (Other)';
					break;	
				case 'no-build':
					return 'No Build';
					break;
				case 'ruby-gem':
					return 'Ruby Gem';
					break;		
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		hasBuildSettings: function(buildSystem) {
			return (buildSystem != 'no-build' && buildSystem != 'ruby-gem');
		},

		getBuildCommand: function(buildSystem) {
			if (buildSystem == 'other') {
				return this.$el.find('#other-build-command').val();
			} else {
				return this.$el.find('#build-command').val();
			}
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

		showAdvancedSettings: function() {
			this.$el.find('#advanced-settings-accordion').show();
		},

		hideAdvancedSettings: function() {
			this.$el.find('#advanced-settings-accordion').hide();
		},

		showBuildSystem: function(buildSystem) {

			// show appropriate fields
			//
			if (buildSystem == 'other' || buildSystem == 'bundler+other') {
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
			var buildFile = this.$el.find('#build-file').val();
			var buildOptions = this.$el.find('#build-options').val();
			var buildTarget = this.$el.find('#build-target').val();

			// set model attributes
			//
			model.set({

				// configuration attributes
				//
				'config_dir': configurePath != ''? configurePath : null,
				'config_cmd': configureCommand != ''? configureCommand : null,
				'config_opt': configureOptions != ''? configureOptions : null,
				
				// build system attributes
				//
				'build_system': buildSystem != ''? buildSystem : null,
				'build_cmd': buildCommand != ''? buildCommand : null,

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

			// set defaults
			//
			this.setBuildSystemDefaults(buildSystem);

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
