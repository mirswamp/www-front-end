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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/details/edit-package-version-details.tpl',
	'views/base-view',
	'views/packages/info/versions/info/details/package-version-profile/package-version-profile-form-view'
], function($, _, Template, BaseView, PackageVersionProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-version-profile-form'
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
				package_name: this.options.package.get('name'),
				package_url: this.options.package.getAppUrl(),
				package_version_url: this.model.getAppUrl(),
			};
		},

		onRender: function() {

			// display package version profile form view
			//
			this.showChildView('form', new PackageVersionProfileFormView({
				model: this.model,
				package: this.options.package
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

						// return to package version view
						//
						application.navigate('#packages/versions/' + self.model.get('package_version_uuid'));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not save package version changes."
						});
					}
				});
			}
		},

		onClickCancel: function() {
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid'));
		}
	});
});