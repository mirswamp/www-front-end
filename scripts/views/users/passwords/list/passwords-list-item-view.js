/******************************************************************************\
|                                                                              |
|                           passwords-list-item-view.js                        |
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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/passwords/list/passwords-list-item.tpl',
	'registry',
	'models/authentication/app-password',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view',
], function($, _, Backbone, Marionette, Template, Registry, AppPassword, ConfirmView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click a': 'onClickLabel',
			'click .delete button': 'onClickDelete',
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				readOnly: this.options.readOnly,
				showDelete: this.options.showDelete
			}));
		},

		//
		// event handling methods
		//

		onClickLabel: function() {
			var self = this;
			require([
				'views/users/passwords/dialogs/edit-password-view',
			], function (EditPasswordView) {
				Registry.application.modal.show(
					new EditPasswordView({
						model: self.model
					})
				);
			});
		},

		onClickDelete: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Password",
					message: "Are you sure you wish to delete this password?",

					// callbacks
					//
					accept: function() {
						self.model.destroy({

							// callbacks
							//
							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this password."
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
