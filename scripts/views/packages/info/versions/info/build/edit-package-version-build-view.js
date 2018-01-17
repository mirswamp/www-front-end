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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/edit-package-version-build.tpl',
	'registry',
	'widgets/accordions',
	'collections/packages/package-version-dependencies',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/build/build-script/build-script-view',
	'views/packages/info/versions/info/build/build-profile/build-profile-form-view',
], function($, _, Backbone, Marionette, Template, Registry, Accordions, PackageVersionDependencies, ErrorView, BuildScriptView, BuildProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			buildProfileForm: '#build-profile-form',
			buildScript: '#build-script'
		},

		events: {
			'change input, select': 'onChange',
			'keyup input, select': 'onChange',
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click .alert-warning .close': 'onClickAlertWarningClose',
			'click #save': 'onClickSave',
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

		saveDependencies: function(options) {
			var self = this;
			
			// set dependencies to belong to this package version
			//
			var packageVersionUuid = this.model.get('package_version_uuid');
			this.packageVersionDependencies.each(function(item) { 
				item.set('package_version_uuid', packageVersionUuid);
			});

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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.options.model,
				package: this.options.package
			}));
		},

		onRender: function() {
			
			// show subviews
			//
			this.showBuildProfileForm();
			this.showBuildScript();

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
					self.buildProfileForm.show(
						new BuildProfileFormView({
							model: self.model,
							package: self.options.package,
							packageVersionDependencies: self.packageVersionDependencies,
							deletedPackageVersionDependencies: self.deletedPackageVersionDependencies,
							parent: self,

							// callbacks
							//
							onChange: function() {

								// update build script
								//
								if (self.buildProfileForm.currentView.packageTypeForm.currentView.getBuildSystem) {
									if (self.buildProfileForm.currentView.packageTypeForm.currentView.getBuildSystem() != 'no-build' &&
										self.buildProfileForm.currentView.packageTypeForm.currentView.getBuildSystem() != 'none')
									{
										self.showBuildScript(self.buildProfileForm.currentView.focusedInput);
									}
								}

								// enable save button
								//
								self.onChange();
							}
						})
					);
				}
			});
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
			if (this.buildProfileForm.currentView.isValid()) {

				// update model
				//
				this.buildProfileForm.currentView.update(this.model);

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
								Backbone.history.navigate('#packages/versions/' + self.model.get('package_version_uuid') + '/build', {
									trigger: true
								});
							}
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save package version changes."
							})
						);
					}
				});
			}
		},

		onClickCancel: function() {

			// go to package versions view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build', {
				trigger: true
			});
		}
	});
});
