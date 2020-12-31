/******************************************************************************\
|                                                                              |
|                           classes-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single class list item.             |
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
	'text!templates/users/accounts/classes/list/classes-list-item.tpl',
	'models/users/user-class',
	'views/collections/tables/table-list-item-view',
], function($, _, Template, UserClass, TableListItemView) {
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
				showDelete: this.options.showDelete
			};
		},

		//
		// event handling methods
		//

		onClickLabel: function() {
			var self = this;
			require([
				'views/users/accounts/classes/dialogs/edit-class-dialog-view',
			], function (EditClassDialogView) {
				application.show(new EditClassDialogView({
					model: self.model
				}));
			});
		},

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Class",
				message: "Are you sure you wish to delete this class?",

				// callbacks
				//
				accept: function() {
					self.model.removeMember(self.options.user, {

						// callbacks
						//
						success: function() {

							// remove item from list
							//
							self.model.collection.remove(self.model);
							self.options.parent.update();
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this class."
							});
						}
					});
				}
			});
		}
	});
});
