/******************************************************************************\
|                                                                              |
|                       edit-package-version-details-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a package versions's details.       |
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
	'text!templates/packages/info/versions/info/details/edit-package-version-details.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/details/package-version-profile/package-version-profile-form-view'
], function($, _, Backbone, Marionette, Template, Registry, ErrorView, PackageVersionProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageVersionProfileForm: '#package-version-profile-form'
		},

		events: {
			'change input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
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

			// display package version profile form view
			//
			this.packageVersionProfileForm.show(
				new PackageVersionProfileFormView({
					model: this.model
				})
			);
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.packageVersionProfileForm.currentView.isValid()) {

				// update model
				//
				this.packageVersionProfileForm.currentView.update(this.model);

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);
				
				// save changes
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {

						// return to package version view
						//
						Backbone.history.navigate('#packages/versions/' + self.model.get('package_version_uuid'), {
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
			}
		},

		onClickCancel: function() {
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid'), {
				trigger: true
			});
		}
	});
});