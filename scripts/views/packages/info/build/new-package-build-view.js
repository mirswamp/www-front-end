/******************************************************************************\
|                                                                              |
|                            new-package-build-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a package version's build info.     |
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
	'text!templates/packages/info/build/new-package-build.tpl',
	'registry',
	'widgets/accordions',
	'models/projects/project',
	'collections/projects/projects',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/build/build-script/build-script-view',
	'views/packages/info/versions/info/build/build-profile/build-profile-form-view',
], function($, _, Backbone, Marionette, Template, Registry, Accordions, Project, Projects, ErrorView, BuildScriptView, BuildProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			buildProfileForm: '#build-profile-form'
		},

		events: {
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click .alert-warning .close': 'onClickAlertWarningClose',
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
			this.options.packageVersion.set({
				'version_sharing_status': 'protected'
			});

			// save package and version
			//
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
						self.options.packageVersion.saveSharedProjects(new Projects([trialProject]), {
				
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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not save package versions's project sharing."
									})
								);
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch trial project."
							})
						);
					}
				});
			});	
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				package: this.model,
				show_save: this.options.showSave,
				show_source_files: !this.model.isBuildable() && !this.options.packageVersion.isAtomic(),
				show_build_script: this.model.hasBuildScript() && this.options.packageVersion.hasBuildScript()
			}));
		},

		onRender: function() {
			this.showBuildProfileForm();

			// change accordion icon
			//
			new Accordions(this.$el);
		},

		showBuildProfileForm: function() {
			var self = this;

			// show build profile form view
			//
			this.buildProfileForm.show(
				new BuildProfileFormView({
					model: this.options.packageVersion,
					packageVersionDependencies: this.options.packageVersionDependencies,
					package: this.model,
					parent: this,

					// update build script upon change
					//
					onChange: function() {
						self.onChange();	
					}
				})
			);
		},

		showSourceFiles: function() {
			var self = this;

			// get current model
			//
			var model = this.buildProfileForm.currentView.getCurrentModel();

			// fetch build info
			//
			model.fetchBuildInfo({
				data: {
					'package_type_id': this.model.get('package_type_id'),
					'build_dir': model.get('build_dir') || '.'
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
				Registry.application.modal.show(
					new SourceFilesDialogView({
						model: packageVersion,
						package: self.model
					})
				);
			});
		},

		showBuildScript: function() {
			var self = this;

			// get current model
			//
			var model = this.buildProfileForm.currentView.getCurrentModel();

			// fetch build info
			//
			model.fetchBuildInfo({
				data: {
					'package_type_id': this.model.get('package_type_id'),
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
				Registry.application.modal.show(
					new BuildScriptDialogView({
						model: packageVersion,
						package: self.model
					})
				);
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
			if (message) {
				this.$el.find('.alert-warning .message').html(message);
			}
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		setNextDisabled: function(disabled) {
			this.$el.find('#next').prop('disabled', disabled);
		},

		//
		// event handling methods
		//

		onChange: function() {

			// enable next button
			//
			this.setNextDisabled(false);
		},

		onClickAlertInfoClose: function() {
			this.hideNotice();
		},

		onClickAlertWarningClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {
			var self = this;

			// update package version
			//
			this.buildProfileForm.currentView.update(this.options.packageVersion);

			// check validation
			//
			if (this.buildProfileForm.currentView.isValid()) {
				var model = this.buildProfileForm.currentView.getCurrentModel();

				// check build system
				//
				model.checkBuildSystem({

					// callbacks
					//
					success: function() {

						// disable save button
						//
						self.$el.find('#save').prop('disabled', true);

						// save new package
						//
						self.save();
					},

					error: function(data) {
						Registry.application.confirm({
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
			this.buildProfileForm.currentView.update(this.options.packageVersion);

			// check validation
			//
			if (this.buildProfileForm.currentView.isValid()) {
				var model = this.buildProfileForm.currentView.getCurrentModel();

				// check build system
				//
				model.checkBuildSystem({

					// callbacks
					//
					success: function() {

						// show next view
						//
						self.options.parent.showSharing();
					},

					error: function(data) {
						Registry.application.confirm({
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

			// go to packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});
		}
	});
});
