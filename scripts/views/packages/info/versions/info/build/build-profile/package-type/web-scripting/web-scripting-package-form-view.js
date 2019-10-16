/******************************************************************************\
|                                                                              |
|                      web-scripting-package-form-view.js                      |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/web-scripting/web-scripting-package-form.tpl',
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
			'click #configure-path button': 'onClickSelectConfigurePath',
			'click #build-path button': 'onClickSelectBuildPath',
			'click #build-file button': 'onClickSelectBuildFile'
		},

		buildCommands: {
			'no-build': 	undefined,
			'npm': 			'npm',
			'composer':		'composer',
			'pear': 		'make'
		},

		//
		// setting methods
		//

		setBuildSystem: function(buildSystem) {

			// set selector
			//
			switch (buildSystem) {
				case 'no-build':
					this.$el.find('#build-system select').val('no-build');
					this.onSetBuildSystem();	
					break;

				case 'npm':
				case 'composer':
				case 'pear':
					this.$el.find('#build-system select').val(buildSystem);
					this.onSetBuildSystem();
					break;
				
				default:

					// select 'no build' or 'other' by default
					//
					if (this.hasBuildSystem('no-build')) {
						this.$el.find('#build-system select').val('no-build');
						this.onSetBuildSystem();
					} else {
						this.$el.find('#build-system select').val('other');
						this.onSetBuildSystem();
					}
					break;			
			}
		},

		setBuildSystemDefaults: function(buildSystem) {

			// set default commands
			//
			this.$el.find('#build-command input').val(this.buildCommands[buildSystem]);
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			return this.$el.find('#build-system select').val();
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'no-build':
					return 'No Build';
				case 'npm':
					return 'NPM';
				case 'composer':
					return 'Composer';
				case 'pear':
					return 'Pear';
				case 'other':
					return 'Other';
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		hasBuildSettings: function(buildSystem) {
			return (buildSystem != 'no-build');
		},

		getBuildCommand: function(buildSystem) {
			if (buildSystem == 'other') {
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

			// show appropriate fields
			//
			switch (buildSystem) {

				case 'pear':

					// show / hide panels
					//
					this.$el.find('#configure-settings').hide();
					this.$el.find('#build-settings').hide();
					break;

				case 'npm':
				case 'composer':

					// show / hide panels
					//
					this.$el.find('#configure-settings').show();
					this.$el.find('#build-settings').hide();
					break;

				case 'none':
				case 'no-build':

					// show / hide panels
					//
					this.$el.find('#configure-settings').show();
					this.$el.find('#build-settings').hide();
					break;

				case 'other':

					// show / hide panels
					//
					this.$el.find('#configure-settings').show();
					this.$el.find('#build-settings').show();

					// show / hide fields
					//
					this.$el.find('#other-build-command').show();
					this.$el.find('#build-command').hide();
					this.$el.find('#build-file').hide();
					break;

				default:

					// show / hide panels
					//
					this.$el.find('#configure-settings').show();
					this.$el.find('#build-settings').show();

					// show / hide fields
					//
					this.$el.find('#other-build-command').hide();
					this.$el.find('#build-command').show();
					this.$el.find('#build-file').show();
					break;
			}
		},

		//
		// form methods
		//

		getValues: function() {
			var buildSystem = this.getBuildSystem();

			return {

				// build system attributes
				//
				'build_system': buildSystem,
				'build_cmd': this.getBuildCommand(buildSystem),

				// configuration attributes
				//
				'config_dir': this.$el.find('#configure-path input:visible').val(),
				'config_cmd': this.$el.find('#configure-command input:visible').val(),
				'config_opt': this.$el.find('#configure-options input:visible').val(),

				// build attributes
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

			// call onchange callback
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
			if (buildSystem == 'no-build') {
				this.options.parent.options.parent.showNotice(this.notices['select-none']);
			} else {
				this.options.parent.options.parent.hideNotice();	
			}

			// perform calllback
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
			application.show(new SelectPackageVersionDirectoryDialogView({
				model: this.model,
				title: "Select Configure Path",
				selectedDirectoryName: sourceDirectory.getPathTo(configurePath),

				// callbacks
				//
				accept: function(selectedDirectoryName) {

					// make path relative to package path
					//
					selectedDirectoryName = sourceDirectory.getRelativePathTo(selectedDirectoryName);

					// set build path input
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
			var buildPath = this.$el.find('#build-path').val();

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
