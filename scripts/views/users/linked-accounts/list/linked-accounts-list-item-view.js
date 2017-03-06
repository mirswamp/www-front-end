/******************************************************************************\
|                                                                              |
|                        linked-accounts-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single permission item.             |
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
	'text!templates/users/linked-accounts/list/linked-accounts-list-item.tpl',
	'registry',
	'config',
	'models/authentication/user-linked-account',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
], function($, _, Backbone, Marionette, Template, Registry, Config, UserLinkedAccount, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'change select.status': 'onChangeStatus',
			'click .delete button': 'onClickDelete',
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, { 
				admin: Registry.application.session.user.get('admin_flag') == '1',
				account: data,
				showStatus: this.options.showStatus,
				showDelete: this.options.showDelete
			});
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Unlink Account",
					message: "Are you sure you wish to unlink this " + self.model.get('title') + " account?",

					// callbacks
					//
					accept: function() {
						var account = new UserLinkedAccount({
							'linked_account_id': self.model.get('linked_account_id')
						});

						account.destroy({

							// callbacks
							//
							success: function() {

								// show success notify view
								//
								Registry.application.modal.show(
									new NotifyView({
										message: "The account has been successfully unlinked.",
										accept: function(){
											self.options.parent.render();
										}
									})
								);
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not unlink this account."
									})
								);
							}
						});
					}
				})
			);
		},

		onChangeStatus: function(event) {
			this.model.setEnabled(event.target.value, {

				// callbacks
				//
				success: function() {

					// show success notify view
					//
					Registry.application.modal.show(
						new NotifyView({
							message: "Linked account status updated."
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not update this linked account's status."
						})
					);
				}
			});
		}
	});
});
