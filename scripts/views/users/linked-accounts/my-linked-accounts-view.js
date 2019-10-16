/******************************************************************************\
|                                                                              |
|                             my-linked-accounts-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's linked-accounts.          |
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
	'models/authentication/user-linked-account',
	'collections/authentication/user-linked-accounts',
	'text!templates/users/linked-accounts/my-linked-accounts.tpl',
	'views/base-view',
	'views/users/linked-accounts/list/linked-accounts-list-view',
], function($, _, UserLinkedAccount, UserLinkedAccounts, Template, BaseView, LinkedAccountsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#linked-accounts-list'
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = application.session.user;
			this.collection = new UserLinkedAccounts();
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show list subview
			//
			this.fetchAndShowLinkedAccountsList();
		},

		showLinkedAccountsList: function() {
			this.showChildView('list', new LinkedAccountsListView({
				model: this.model,
				collection: this.collection,
				showDelete: true,
				parent: this
			}));
		},

		fetchAndShowLinkedAccountsList: function() {
			var self = this;

			// fetch collection of linked accounts
			//
			this.collection.fetchByUser(self.model, {

				// callbacks
				//
				success: function() {
					self.showLinkedAccountsList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get linked accounts for this user."
					});
				}
			});
		}
	});
});
