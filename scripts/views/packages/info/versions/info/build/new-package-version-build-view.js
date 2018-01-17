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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/new-package-version-build.tpl',
	'widgets/accordions',
	'models/projects/project',
	'collections/projects/projects',
	'views/packages/info/versions/info/build/build-profile/build-profile-form-view',
	'views/packages/info/versions/info/build/build-script/build-script-view'
], function($, _, Backbone, Marionette, Template, Accordions, Project, Projects, BuildProfileFormView, BuildScriptView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			buildProfileForm: '#build-profile-form',
			buildScript: '#build-script'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #next': 'onClickNext',
			'click #prev': 'onClickPrev',
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

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				package: this.options.package,
				showSave: this.options.showSave
			}));
		},

		onRender: function() {
			this.showBuildProfileForm();
			this.showBuildScript();

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		},

		showBuildProfileForm: function() {
			var self = this;

			// show build profile form
			//
			this.buildProfileForm.show(
				new BuildProfileFormView({
					model: this.model,
					package: this.options.package,
					packageVersionDependencies: this.options.packageVersionDependencies,
					parent: this,

					// update build script upon change
					//
					onChange: function() {
						self.showBuildScript(self.buildProfileForm.currentView.focusedInput);
					}	
				})
			);
		},

		showBuildScript: function(focusedInput) {

			// get current model
			//
			if (this.buildProfileForm.currentView) {
				var currentModel = this.buildProfileForm.currentView.getCurrentModel();
			} else {
				var currentModel = this.model;
			}

			if (currentModel.isBuildNeeded()) {

				// unhide build script accordion
				//
				this.$el.find('#build-script-accordion').show();

				// show build script view
				//
				this.buildScript.show(
					new BuildScriptView({
						model: currentModel,
						package: this.options.package,
						highlight: focusedInput
					})
				);
			} else {

				// hide build script accordion
				//
				this.$el.find('#build-script-accordion').hide();
			}
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

			// update package version
			//
			this.buildProfileForm.currentView.update(this.model);

			// check validation
			//
			if (this.buildProfileForm.currentView.isValid()) {

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);
				
				// save package version
				//
				this.save();
			} else {

				// show warning message bar
				//
				this.showWarning("This form contains errors.  Please correct and resubmit.");
			}
		},

		onClickNext: function() {

			// update package version
			//
			this.buildProfileForm.currentView.update(this.model);

			// check validation
			//
			if (this.buildProfileForm.currentView.isValid()) {

				// show next view
				//
				this.options.parent.showSharing();
			} else {

				// show warning message bar
				//
				this.showWarning("This form contains errors.  Please correct and resubmit.");
			}
		},

		onClickPrev: function() {
			this.options.parent.showSource();
		},

		onClickCancel: function() {

			// go to package view
			//
			Backbone.history.navigate('#packages/' + this.options.package.get('package_uuid'), {
				trigger: true
			});
		}
	});
});
