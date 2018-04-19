/******************************************************************************\
|                                                                              |
|                            classes-list-item-view.js                         |
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/users/classes/list/classes-list-item.tpl',
	'registry',
	'models/users/user-class',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view',
], function($, _, Backbone, Marionette, Template, Registry, UserClass, ConfirmView, ErrorView) {
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
				showDelete: this.options.showDelete
			}));
		},

		//
		// event handling methods
		//

		onClickLabel: function() {
			var self = this;
			require([
				'views/users/classes/dialogs/edit-class-view',
			], function (EditClassView) {
				Registry.application.modal.show(
					new EditClassView({
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

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this class."
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
