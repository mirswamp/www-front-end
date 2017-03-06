/******************************************************************************\
|                                                                              |
|                            system-admins-list-view.js                        |
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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/settings/system-admins/system-admins-list/system-admins-list-item.tpl',
	'config',
	'registry',
	'views/dialogs/error-view',
	'views/dialogs/confirm-view',
], function($, _, Backbone, Marionette, Template, Config, Registry, ErrorView, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				config: Registry.application.config,
				url: Registry.application.getURL() + '#accounts',
				showDelete: this.options.showDelete
			}));
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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this user's administrator priviledges."
									})
								);
							}
						});
					}
				})
			);
		}
	});
});
