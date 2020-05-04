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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/accounts/linked-accounts/list/linked-accounts-list-item.tpl',
	'models/authentication/user-linked-account',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, UserLinkedAccount, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'change select.status': 'onChangeStatus',
			'click .delete button': 'onClickDelete',
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return { 
				admin: application.session.user.get('admin_flag'),
				showStatus: this.options.showStatus,
				showDelete: this.options.showDelete
			};
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
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

							// update view
							//
							self.options.parent.render();
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not unlink this account."
							});
						}
					});
				}
			});
		},

		onChangeStatus: function(event) {
			this.model.setEnabled(event.target.value, {

				// callbacks
				//
				success: function() {

					// show success notify view
					//
					application.notify({
						message: "Linked account status updated."
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not update this linked account's status."
					});
				}
			});
		}
	});
});
