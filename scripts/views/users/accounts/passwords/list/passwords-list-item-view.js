/******************************************************************************\
|                                                                              |
|                          passwords-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single password list item.          |
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
	'text!templates/users/accounts/passwords/list/passwords-list-item.tpl',
	'models/authentication/app-password',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, AppPassword, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click a': 'onClickLabel',
			'click .delete button': 'onClickDelete',
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				readOnly: this.options.readOnly,
				showDelete: this.options.showDelete
			};
		},

		//
		// event handling methods
		//

		onClickLabel: function() {
			var self = this;
			require([
				'views/users/accounts/passwords/dialogs/edit-password-dialog-view',
			], function (EditPasswordDialogView) {
				application.show(new EditPasswordDialogView({
					model: self.model,

					// callbacks
					//
					onSave: function() {

						// update list
						//
						self.options.parent.render();
					}
				}));
			});
		},

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Password",
				message: "Are you sure you wish to delete this password?",

				// callbacks
				//
				accept: function() {
					self.model.destroy({

						// callbacks
						//
						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this password."
							});
						}
					});
				}
			});
		}
	});
});
