/******************************************************************************\
|                                                                              |
|                           edit-package-details-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a package's profile info.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/details/edit-package-details.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/packages/info/details/package-profile/package-profile-form-view'
], function($, _, Backbone, Marionette, Template, Registry, ErrorView, PackageProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageProfileForm: '#package-profile-form'
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
				package: this.model
			}));
		},

		onRender: function() {

			// display package profile form view
			//
			this.packageProfileForm.show(
				new PackageProfileFormView({
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
			if (this.packageProfileForm.currentView.isValid()) {

				// update model
				//
				this.packageProfileForm.currentView.update(this.model);

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);
			
				// save changes
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {

						// return to package view
						//
						Backbone.history.navigate('#packages/' + self.model.get('package_uuid'), {
							trigger: true
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save package changes."
							})
						);
					}
				});
			}
		},

		onClickCancel: function() {
			Backbone.history.navigate('#packages/' + this.model.get('package_uuid'), {
				trigger: true
			});
		}
	});
});
