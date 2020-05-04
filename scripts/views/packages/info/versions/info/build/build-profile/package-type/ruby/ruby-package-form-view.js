/******************************************************************************\
|                                                                              |
|                           ruby-package-form-view.js                          |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package-form.tpl',
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
			'click #configure-path button': 'onClickConfigurePathButton',
			'click #build-path button': 'onClickBuildPathButton',
			'click #build-file button': 'onClickBuildFileButton'
		},

		buildCommands: {
			'bundler': 			"bundle install", 
			'bundler+rake': 	"bundle exec rake", 
			'bundler+other': 	undefined,
			'rake':				'rake',
			'other': 			undefined,
			'none': 			undefined, 
			'ruby-gem':  		'gem'
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
				case 'none':
					this.$el.find("#build-system").val('none');
					this.onSetBuildSystem();	
					break;
				case 'ruby-gem':
					this.$el.find("#build-system").val('ruby-gem');
					this.onSetBuildSystem();	
					break;
				default:

					// select 'no build' by default
					//
					this.$el.find("#build-system").val('none');
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
			switch (this.$el.find('#build-system select').val()) {
				case 'bundler':
					return 'bundler';
				case 'bundler-rake':
					return 'bundler+rake';
				case 'bundler-other':
					return 'bundler+other';
				case 'rake':
					return 'rake';
				case 'other':
					return 'other';
				case 'no-build':
					return 'no-build';
				case 'ruby-gem':
					return 'ruby-gem';
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'bundler':
					return 'Bundler';
				case 'bundler+rake':
					return 'Bundler + Rake';
				case 'bundler+other':
					return 'Bundler + Other';
				case 'rake':
					return 'Rake';
				case 'other':
					return 'Build (Other)';
				case 'no-build':
					return 'None';
				case 'ruby-gem':
					return 'Ruby Gem';
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		getBuildCommand: function(buildSystem) {
			if (buildSystem == 'other' || buildSystem == 'bundler+other') {
				return this.$el.find('#other-build-command input').val();
			} else {
				return this.$el.find('#build-command input').val();
			}
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

			// call superclass method
			//
			PackageTypeFormView.prototype.onRender.call(this);
		},

		showBuildSystem: function(buildSystem) {

			// show / hide advanced settings
			//
			if (buildSystem == 'ruby-gem') {
				this.$el.find('#configure-settings').hide();
				this.$el.find('#build-settings').hide();
			} else if (!buildSystem || buildSystem == 'none' || buildSystem == 'no-build' || buildSystem == 'bundler') {
				this.$el.find('#configure-settings').show();
				this.$el.find('#build-settings').hide();
			} else {
				this.$el.find('#configure-settings').show();
				this.$el.find('#build-settings').show();
			}

			// show / hide build command
			//
			if (buildSystem == 'other' || buildSystem == 'bundler+other') {
				this.$el.find('#other-build-command').show();
				this.$el.find('#build-command').hide();
				this.$el.find('#build-file').hide();
			} else {
				this.$el.find('#other-build-command').hide();
				this.$el.find('#build-command').show();
				this.$el.find('#build-file').show();
			}

			// show / hide build settings
			//
			if (!buildSystem || buildSystem == 'none') {
				this.$el.find('#build-path').hide();
				this.$el.find('#build-options').hide();
				this.$el.find('#build-target').hide();
			} else {
				this.$el.find('#build-path').show();
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
				'build_target': this.$el.find('#build-target input:visible').val()
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
			if (buildSystem == 'no-build') {
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

			// show / hide no build notice
			//
			if (buildSystem == 'no-build') {
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
			application.show(new SelectPackageVersionDirectoryDialogView({
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
			});

			// prevent further handling of event
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
