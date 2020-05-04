/******************************************************************************\
|                                                                              |
|                         system-admins-list-item-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single system administrator.        |
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
	'text!templates/admin/settings/system-admins/system-admins-list/system-admins-list-item.tpl',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				name: this.model.getFullName(),
				url: this.model.getAppUrl(),
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
				title: "Delete Administrator Priviledges",
				message: "Are you sure that you want to delete " + this.model.getFullName() + "'s administrator priviledges?",

				// callbacks
				//
				accept: function() {

					// delete user's admin priviledges
					//
					self.model.deleteAdminPriviledges({

						// callbacks
						//
						success: function() {

							// remove item from collection
							//
							self.model.collection.remove(self.model);
						},

						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this user's administrator priviledges."
							});
						}
					});
				}
			});
		}
	});
});
