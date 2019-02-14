/******************************************************************************\
|                                                                              |
|                        edit-package-version-source-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a package versions's source         |
|        information.                                                          |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/packages/info/versions/info/source/edit-package-version-source.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/source/source-profile/package-version-source-profile-form-view',
	'views/packages/info/versions/info/source/dialogs/package-version-file-types-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, Registry, ErrorView, PackageVersionSourceProfileFormView, PackageVersionFileTypesView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageVersionSourceProfileForm: '#package-version-source-profile-form'
		},

		events: {
			'input input': 'onChangeInput',
			'keyup input': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #show-file-types': 'onClickShowFileTypes',
			'click #cancel': 'onClickCancel'
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

					// return to package version source view
					//
					Backbone.history.navigate('#packages/versions/' + self.model.get('package_version_uuid') + '/source', {
						trigger: true
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
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				package: this.options.package
			}));
		},

		onRender: function() {
			var self = this;

			// show profile
			//
			this.packageVersionSourceProfileForm.show(
				new PackageVersionSourceProfileFormView({
					model: this.model,
					package: this.options.package,
					parent: this,

					// callbacks
					//
					onChange: function() {

						// enable save button
						//
						self.$el.find('#save').prop('disabled', false);
					}
				})
			);
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

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickPrev: function() {

			// show next prev view
			//
			this.options.parent.showDetails();
		},
		
		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.packageVersionSourceProfileForm.currentView.isValid()) {

				// update model
				//
				this.packageVersionSourceProfileForm.currentView.update(this.model);

				// check build system
				//
				this.model.checkBuildSystem({

					// callbacks
					//
					success: function() {
		
						// save package version
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

								// save package version
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

		onClickShowFileTypes: function() {

			// show package version file types dialog
			//
			Registry.application.modal.show(
				new PackageVersionFileTypesView({
					model: this.model,
					packagePath: this.packageVersionSourceProfileForm.currentView.getPackagePath()
				})
			);
		},

		onClickCancel: function() {

			// go to package view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/source', {
				trigger: true
			});
		}
	});
});