/******************************************************************************\
|                                                                              |
|                            user-passwords-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a user's application passwords.       |
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
	'collections/authentication/app-passwords',
	'text!templates/users/passwords/user-passwords.tpl',
	'registry',
	'views/users/passwords/list/passwords-list-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, AppPasswords, Template, Registry, PasswordsListView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			passwordsList: '#passwords-list'
		},

		events: {
			'click #add-new-password': 'onClickAddNewPassword'
		},

		//
		// methods
		//

		initialize: function() {

			// set attributes
			//
			this.model = this.options.model;
			this.collection = new AppPasswords();
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show list subview
			//
			this.fetchAndShowPasswordsList();
		},

		showPasswordsList: function() {
			this.passwordsList.show(
				new PasswordsListView({
					collection: this.collection,
					readOnly: true,
					showDelete: true
				})
			);
		},

		fetchAndShowPasswordsList: function() {
			var self = this;

			// fetch collection of passwords
			//
			this.collection.fetchByUser(self.model, {

				// callbacks
				//
				success: function(data) {
					self.showPasswordsList();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get passwords for this user."
						})
					);
				}
			});
		},

		//
		// event handling methods
		//

		onClickAddNewPassword: function() {
			var self = this;
			require([
				'views/users/passwords/dialogs/add-new-password-view'
			], function (AddNewPasswordView) {
				Registry.application.modal.show(
					new AddNewPasswordView({
						collection: self.collection
					})
				);
			});
		}
	});
});
