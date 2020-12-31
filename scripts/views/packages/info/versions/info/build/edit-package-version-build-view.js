/******************************************************************************\
|                                                                              |
|                        edit-package-version-build-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a package version's build           |
|        information.                                                          |
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
	'text!templates/packages/info/versions/info/build/edit-package-version-build.tpl',
	'widgets/accordions',
	'collections/packages/package-version-dependencies',
	'views/base-view',
	'views/packages/info/versions/info/build/build-script/build-script-view',
	'views/packages/info/versions/info/build/build-profile/build-profile-form-view',
], function($, _, Template, Accordions, PackageVersionDependencies, BaseView, BuildScriptView, BuildProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#build-profile-form'
		},

		events: {
			'input input': 'onChange',
			'change select': 'onChange',
			'keyup input, select': 'onChange',
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click .alert-warning .close': 'onClickAlertWarningClose',
			'click #save': 'onClickSave',
			'click #show-source-files': 'onClickShowSourceFiles',
			'click #show-build-script': 'onClickShowBuildScript',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.deletedPackageVersionDependencies = new PackageVersionDependencies();
		},

		//
		// methods
		//

		save: function() {
			var self = this;
			
			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);

			// save changes
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {
					self.saveDependencies({

						// callbacks
						//
						success: function() {

							// return to package version build info view
							//
							application.navigate('#packages/versions/' + self.model.get('package_version_uuid') + '/build');
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save package version changes."
					});
				}
			});
		},

		saveDependencies: function(options) {
			var self = this;

			// save package dependencies
			// 
			this.packageVersionDependencies.save({

				// callbacks
				//
				success: function() {

					// destroy deleted dependencies
					//
					self.deletedPackageVersionDependencies.destroy(options);
				},

				error: function() {
					if (options.error) {
						options.error();
					}
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package_name: this.options.package.get('name'),
				package_url: this.options.package.getAppUrl(),
				package_version_url: this.model.getAppUrl(),
				show_source_files: !this.options.package.isBuildable() && !this.model.isAtomic(),
				show_build_script: this.model.hasBuildScript() && this.options.package.hasBuildScript()
			};
		},

		onRender: function() {
			
			// show subviews
			//
			this.showBuildProfileForm();

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		showBuildProfileForm: function() {
			var self = this;
			this.packageVersionDependencies = new PackageVersionDependencies();
			this.packageVersionDependencies.fetchByPackageVersion( this.model.get('package_version_uuid'), {
				success: function() {

					// show build profile form
					//
					self.showChildView('form', new BuildProfileFormView({
						model: self.model,
						package: self.options.package,
						packageVersionDependencies: self.packageVersionDependencies,
						deletedPackageVersionDependencies: self.deletedPackageVersionDependencies,
						parent: self,

						// callbacks
						//
						onChange: function() {
							self.onChange();	
						}
					}));
				}
			});
		},

		showSourceFiles: function() {
			var self = this;

			// get current model
			//
			var model = this.getChildView('form').getCurrentModel();

			// fetch build info
			//
			model.fetchBuildInfo({

				// callbacks
				//
				success: function(data) {
					model.set({
						'source_files': data.source_files
					});

					self.showSourceFilesDialog(model);
				}
			});
		},

		showSourceFilesDialog: function(packageVersion) {
			var self = this;
			require([
				'views/packages/dialogs/source-files-dialog-view'
			], function (SourceFilesDialogView) {
				application.show(new SourceFilesDialogView({
					model: packageVersion,
					package: self.options.package
				}));
			});
		},
		
		showBuildScript: function() {
			var self = this;

			// get current model
			//
			var model = this.getChildView('form').getCurrentModel();

			// fetch build info
			//
			model.fetchBuildInfo({
				data: {
					'package_type_id': this.model.get('package_type_id'),
					'build_dir': model.get('build_dir')
				},
				
				// callbacks
				//
				success: function(data) {
					model.set({
						'no_build_cmd': data.no_build_cmd
					});

					// show build script dialog
					//
					self.showBuildScriptDialog(model);
				}
			});
		},
		
		showBuildScriptDialog: function(packageVersion) {
			var self = this;
			require([
				'views/packages/dialogs/build-script-dialog-view'
			], function (BuildScriptDialogView) {
				application.show(new BuildScriptDialogView({
					model: packageVersion,
					package: self.options.package
				}));
			});
		},

		hideBuildScript: function() {
			this.$el.find('#build-script-accordion').hide();
		},

		showBuildInfo: function() {
			this.$el.find('#build-info').show();
		},

		hideBuildInfo: function() {
			this.$el.find('#build-info').hide();
		},

		showNotice: function(message) {
			this.$el.find('.alert-info').find('.message').html(message);
			this.$el.find('.alert-info').show();
		},

		hideNotice: function() {
			this.$el.find('.alert-info').hide();
		},
		
		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onChange: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickAlertInfoClose: function() {
			this.hideNotice();
		},

		onClickAlertWarningClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

				// check build system
				//
				this.model.checkBuildSystem({

					// callbacks
					//
					success: function() {

						// save new package
						//
						self.save();
					},

					error: function(data) {
						application.confirm({
							title: 'Build System Warning',
							message: data.responseText + "  Would you like to continue anyway?",

							// callbacks
							//
							accept: function() {

								// show next view
								//
								self.save();
							}
						});
					}
				});
			}
		},

		onClickShowSourceFiles: function() {
			this.showSourceFiles();
		},

		onClickShowBuildScript: function() {
			this.showBuildScript();
		},

		onClickCancel: function() {

			// go to package versions view
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build');
		}
	});
});
