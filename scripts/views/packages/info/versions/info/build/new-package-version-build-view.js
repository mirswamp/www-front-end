/******************************************************************************\
|                                                                              |
|                       new-package-version-build-view.js                      |
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
	'text!templates/packages/info/versions/info/build/new-package-version-build.tpl',
	'widgets/accordions',
	'models/projects/project',
	'collections/projects/projects',
	'views/base-view',
	'views/packages/info/versions/info/build/build-profile/build-profile-form-view',
	'views/packages/info/versions/info/build/build-script/build-script-view'
], function($, _, Template, Accordions, Project, Projects, BaseView, BuildProfileFormView, BuildScriptView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#build-profile-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #next': 'onClickNext',
			'click #prev': 'onClickPrev',
			'click #show-source-files': 'onClickShowSourceFiles',
			'click #show-build-script': 'onClickShowBuildScript',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		save: function(done) {
			var self = this;
			
			// update package version
			//
			this.model.set({
				'version_sharing_status': 'protected'
			});

			this.options.parent.save(function() {
				var project = new Project();

				// fetch trial project
				//
				project.fetchCurrentTrial({

					// callbacks
					//
					success: function(data) {
						var trialProject = new Project(data);

						// save sharing with trial project
						//
						self.model.saveSharedProjects(new Projects([trialProject]), {
				
							// callbacks
							//
							success: function() {

								// perform callback
								//
								if (done) {
									done();
								}
							},

							error: function() {

								// show error message
								//
								application.error({
									message: "Could not save package versions's project sharing."
								});
							}
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch trial project."
						});
					}
				});
			});
		},

		saveSharedProjects: function(done) {
			this.model.saveSharedProjects(this.getSharedProjects(), {
				
				// callbacks
				//
				success: function() {

					// perform callback
					//
					if (done) {
						done();
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save package versions's project sharing."
					});
				}
			});			
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package: this.options.package,
				show_save: this.options.showSave,
				show_source_files: !this.options.package.isBuildable() && !this.model.isAtomic(),
				show_build_script: this.model.hasBuildScript() && this.options.package.hasBuildScript()
			};
		},

		onRender: function() {
			this.showBuildProfileForm();

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		showBuildProfileForm: function() {
			var self = this;

			// show build profile form
			//
			this.showChildView('form', new BuildProfileFormView({
				model: this.model,
				package: this.options.package,
				packageVersionDependencies: this.options.packageVersionDependencies,
				parent: this
			}));
		},

		showSourceFiles: function() {
			var self = this;

			// get current model
			//
			var model = this.getChildView('form').getCurrentModel();

			// fetch build info
			//
			model.fetchBuildInfo({
				data: {
					'package_type_id': this.options.package.get('package_type_id'),
					'build_dir': this.model.get('build_dir') || '.'
				},

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
					'package_type_id': this.options.package.get('package_type_id'),
					'build_dir': model.get('build_dir') || '.'
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

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update package version
				//
				this.getChildView('form').applyTo(this.model);
			
				// check build system
				//
				this.model.checkBuildSystem({

					// callbacks
					//
					success: function() {
		
						// save package version
						//
						self.save(function() {

							// go to package view
							//
							application.navigate('#packages/' + self.model.get('package_uuid'));
						});
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
								self.save(function() {
								
									// go to package view
									//
									application.navigate('#packages/' + self.model.get('package_uuid'));
								});
							}
						});
					}
				});
			} else {

				// show warning message bar
				//
				this.showWarning("This form contains errors.  Please correct and resubmit.");
			}
		},

		onClickNext: function() {
			var self = this;

			// update package version
			//
			this.getChildView('form').applyTo(this.model);

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// check build system
				//
				this.model.checkBuildSystem({

					// callbacks
					//
					success: function() {

						// show next view
						//
						self.options.parent.showSharing();
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
								self.options.parent.showSharing();
							}
						});
					}
				});
			} else {

				// show warning message bar
				//
				this.showWarning("This form contains errors.  Please correct and resubmit.");
			}
		},

		onClickPrev: function() {
			this.options.parent.showSource();
		},

		onClickShowSourceFiles: function() {
			this.showSourceFiles();
		},

		onClickShowBuildScript: function() {
			this.showBuildScript();
		},

		onClickCancel: function() {

			// go to package view
			//
			application.navigate('#packages/' + this.options.package.get('package_uuid'));
		}
	});
});
