/******************************************************************************\
|                                                                              |
|                            user-linked-accounts-view.js                      |
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/authentication/user-linked-account',
	'collections/authentication/user-linked-accounts',
	'text!templates/users/linked-accounts/user-linked-accounts.tpl',
	'registry',
	'views/users/linked-accounts/list/linked-accounts-list-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, UserLinkedAccount, UserLinkedAccounts, Template, Registry, LinkedAccountsListView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: function(){
			return _.template(Template, {
				user: this.options.model
			});
		},

		regions: {
			linkedAccountsList: '#linked-accounts-list'
		},

		//
		// methods
		//

		initialize: function() {
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
			this.linkedAccountsList.show(
				new LinkedAccountsListView({
					model: this.model,
					collection: this.collection,
					showStatus: false,
					showDelete: true,
					parent: this
				})
			);
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get linked accounts for this user."
						})
					);
				}
			});
		}
	});
});
