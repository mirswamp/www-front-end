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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/build/new-package-build.tpl',
	'widgets/accordions',
	'models/projects/project',
	'collections/projects/projects',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/build/build-script/build-script-view',
	'views/packages/info/versions/info/build/build-profile/build-profile-form-view',
], function($, _, Backbone, Marionette, Template, Accordions, Project, Projects, ErrorView, BuildScriptView, BuildProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			buildScript: '#build-script',
			buildProfileForm: '#build-profile-form'
		},

		events: {
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click .alert-warning .close': 'onClickAlertWarningClose',
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
				showSave: this.options.showSave
			}));
		},

		onRender: function() {
			this.showBuildProfileForm();
			this.showBuildScript();

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
						if (self.buildProfileForm.currentView.packageTypeForm.currentView.getBuildSystem() != 'no-build' &&
							self.buildProfileForm.currentView.packageTypeForm.currentView.getBuildSystem() != 'none') {
							self.showBuildScript(self.buildProfileForm.currentView.focusedInput);
						}	
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
				var currentModel = this.options.packageVersion;
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
						package: this.model,
						packageVersionDependencies: this.options.packageVersionDependencies,
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
			if (message) {
				this.$el.find('.alert-warning .message').html(message);
			}
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickAlertInfoClose: function() {
			this.hideNotice();
		},

		onClickAlertWarningClose: function() {
			this.hideWarning();
		},

		onClickSave: function() {

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);

			// update package version
			//
			this.buildProfileForm.currentView.update(this.options.packageVersion);

			// check validation
			//
			if (this.buildProfileForm.currentView.isValid()) {

				// save package and version
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
			this.buildProfileForm.currentView.update(this.options.packageVersion);

			// check validation
			//
			if (this.buildProfileForm.currentView.isValid()) {

				// go to sharing view
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

			// go to packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});
		}
	});
});
