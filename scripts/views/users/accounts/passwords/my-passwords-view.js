/******************************************************************************\
|                                                                              |
|                             my-passwords-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the user's application passwords.     |
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
	'text!templates/users/accounts/passwords/my-passwords.tpl',
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
			'click #add-new-password': 'onClickAddNewPassword',
			'click #delete-all': 'onClickDeleteAll'
		},

		//
		// constructor
		//

		initialize: function() {

			// set attributes
			//
			this.model = application.session.user;
			this.collection = new AppPasswords();
		},

		//
		// methods
		//

		deleteAll: function() {
			var self = this;
			this.collection.deleteAll({

				// callbacks
				//
				success: function() {
					self.fetchAndShowPasswordsList();
				}
			});
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
				readOnly: false,
				showDelete: true
			}));
		},

		fetchAndShowPasswordsList: function() {
			var self = this;

			// fetch collection of passwords
			//
			this.collection.fetch({

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
					collection: self.collection,

					// callbacks
					//
					onAdd: function() {
						self.fetchAndShowPasswordsList();
					}
				}));
			});
		},

		onClickDeleteAll: function() {
			var self = this;

			// show confirm dialog
			//
			application.confirm({
				title: "Delete App Passwords",
				message: "Are you sure that you want to delete all of your application passwords?",

				// callbacks
				//
				accept: function() {
					self.deleteAll();
				}
			});
		}
	});
});
