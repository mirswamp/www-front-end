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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/details/edit-package-details.tpl',
	'views/base-view',
	'views/packages/info/details/package-profile/package-profile-form-view'
], function($, _, Template, BaseView, PackageProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-profile-form'
		},

		events: {
			'input input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				url: this.model.getAppUrl()
			};
		},

		onRender: function() {

			// display package profile form view
			//
			this.showChildView('form', new PackageProfileFormView({
				model: this.model
			}));
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
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

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
						application.navigate('#packages/' + self.model.get('package_uuid'));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not save package changes."
						});
					}
				});
			}
		},

		onClickCancel: function() {
			application.navigate('#packages/' + this.model.get('package_uuid'));
		}
	});
});
