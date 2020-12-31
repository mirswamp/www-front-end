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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'collections/authentication/app-passwords',
	'text!templates/users/accounts/passwords/user-passwords.tpl',
	'views/base-view',
	'views/users/accounts/passwords/list/passwords-list-view',
], function($, _, AppPasswords, Template, BaseView, PasswordsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#passwords-list'
		},

		events: {
			'click #add-new-password': 'onClickAddNewPassword'
		},

		//
		// constructor
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
			this.showChildView('list', new PasswordsListView({
				collection: this.collection,
				readOnly: true,
				showDelete: true
			}));
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

					// show error message
					//
					application.error({
						message: "Could not get passwords for this user."
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickAddNewPassword: function() {
			var self = this;
			require([
				'views/users/accounts/passwords/dialogs/add-new-password-dialog-view'
			], function (AddNewPasswordDialogView) {
				application.show(new AddNewPasswordDialogView({
					collection: self.collection
				}));
			});
		}
	});
});
