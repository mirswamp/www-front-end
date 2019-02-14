/******************************************************************************\
|                                                                              |
|                              c-package-form-view.js                          |
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
	'text!templates/packages/info/versions/info/build/build-profile/package-type/c/c-package-form.tpl',
	'registry',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-file-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-directory-view'
], function($, _, Backbone, Marionette, Template, Registry, Accordions, Directory, PackageTypeFormView,  SelectPackageVersionFileView, SelectPackageVersionDirectoryView) {
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
			'make': 					'make',
			'configure+make':			'make',
			'cmake+make': 				'make', 
			'autotools+configure+make': 'make',
			'other': 					undefined
		},

		configureCommands: {
			'make': 					'',
			'configure+make':			'./configure',
			'cmake+make': 				'cmake .', 
			'autotools+configure+make': 'mkdir -p m4 && autoreconf --install --force || ./autogen.sh && ./configure',
			'other': 					''	
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
				case 'make':
					this.$el.find("#build-system select").val('make');
					this.onSetBuildSystem();
					break;
				case 'cmake+make':
					this.$el.find("#build-system select").val('cmake');
					this.onSetBuildSystem();
					break;
				case 'configure+make':
					this.$el.find("#build-system select").val('configure');
					this.onSetBuildSystem();
					break;
				case 'autotools+configure+make':
					this.$el.find("#build-system select").val('autotools');
					this.onSetBuildSystem();
					break;
				case 'other':
					this.$el.find("#build-system select").val('other');
					this.onSetBuildSystem();
					break;
				default:

					// select 'no build' or 'other' by default
					//
					if (this.hasBuildSystem('no-build')) {
						this.$el.find("#build-system select").val('no-build');
						this.onSetBuildSystem();
					} else {
						this.$el.find("#build-system select").val('other');
						this.onSetBuildSystem();
					}
					break;			
			}
		},

		setBuildSystemDefaults: function(buildSystem) {

			// set default commands
			//
			this.$el.find('#configure-command input').val(this.configureCommands[buildSystem]);
			this.$el.find('#build-command input').val(this.buildCommands[buildSystem]);
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			switch (this.$el.find('#build-system select').val()) {
				case 'no-build':
					return 'no-build';
				case 'make':
					return 'make';
				case 'cmake':
					return 'cmake+make';
				case 'configure':
					return 'configure+make';
				case 'autotools':
					return 'autotools+configure+make';
				case 'other':
					return 'other';
			}
		},

		getBuildSystemName: function(buildSystem) {
			switch (buildSystem) {
				case 'no-build':
					return 'No Build';
				case 'make':
					return 'Make';
				case 'cmake+make':
					return 'CMake + Make';
				case 'configure+make':
					return 'Configure + Make';
				case 'autotools+configure+make':
					return 'Autotools + Configure + Make';
				case 'other':
					return 'Other';
			}
		},

		hasBuildSystem: function(buildSystem) {
			return this.$el.find('#build-system option[value=' + buildSystem + ']').length != 0;
		},

		getBuildCommand: function(buildSystem) {
			if (buildSystem == 'other') {
				return this.$el.find('#other-build-command input').val();
			} else {
				return this.$el.find('#build-command input').val();
			}
		},

		setBuildSettings: function(options) {
			var self = this;

			// fetch and set default build info
			//
			this.model.fetchBuildInfo({
				data: {
					'package_type_id': this.options.package.get('package_type_id'),
					'build_dir': this.model.get('build_dir') || '.'
				},

				// callbacks
				//
				success: function(buildInfo) {

					// set model attributes
					//
					self.model.set({
						'no_build_cmd': buildInfo['no_build_cmd']
					});

					// peform callback
					//
					if (options && options.success) {
						options.success();
					}
				},

				error: function() {

					// perform callback
					//
					if (options && options.error) {
						options.error();
					}
				}
			});
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

		showAdvancedSettings: function() {
			this.$el.find('#advanced-settings').show();
		},

		hideAdvancedSettings: function() {
			this.$el.find('#advanced-settings').hide();
		},

		showBuildSystem: function(buildSystem) {

			// show / hide build command
			//
			if (buildSystem == 'other') {
				this.$el.find('#other-build-command').show();
				this.$el.find('#build-command').hide();
			} else {
				this.$el.find('#other-build-command').hide();
				this.$el.find('#build-command').show();
			}
			
			// show / hide build settings
			//
			if (!buildSystem || buildSystem == 'no-build') {
				this.$el.find('#build-path').show();
				this.$el.find('#build-file').hide();
				this.$el.find('#build-options').hide();
				this.$el.find('#build-target').hide();
			} else if (buildSystem == 'other') {
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
				this.options.parent.options.parent.showNotice(this.notices['no-build']);
			} else {
				this.options.parent.options.parent.hideNotice();
			}
		},

		onChangeBuildSystem: function(event) {
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

			// perform calllback
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
						self.model.set({
							build_dir: selectedDirectoryName
						});

						// fetch new build settings
						//
						self.setBuildSettings({

							// callbacks
							//
							success: function() {
								self.onChange();
							}
						});
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
