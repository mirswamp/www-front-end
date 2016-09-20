/******************************************************************************\
|                                                                              |
|                         change-user-linked-accounts-view.js                  |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'models/authentication/user-linked-account',
	'collections/authentication/user-linked-accounts',
	'text!templates/users/accounts/change-linked-accounts/change-user-linked-accounts.tpl',
	'registry',
	'config',
	'views/users/info/linked-accounts/linked-accounts-list/linked-accounts-list-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, UserLinkedAccount, UserLinkedAccounts, Template, Registry, Config, LinkedAccountsListView, NotifyView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: function(){
			return _.template(Template, {
				user: this.options.model
			});
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
			var self = this;

			// show list subview
			//
			this.showLinkedAccountsList();
		},

		showLinkedAccountsList: function() {
			var self = this;

			// fetch collection of linked accounts
			//
			this.collection.fetchByUser(self.model, {

				// callbacks
				//
				success: function() {

					// show select linked accounts list view
					//
					self.linkedAccountsList = new LinkedAccountsListView({
						el: self.$el.find('#linked-accounts-list'),
						model: self.model,
						collection: self.collection,
						showDelete: true,
						parent: self
					});
					self.linkedAccountsList.render();
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
