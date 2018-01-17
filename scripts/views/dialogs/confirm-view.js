/******************************************************************************\
|                                                                              |
|                               confirm-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a confirmation modal dialog box that is used to          |
|        prompt the user for confirmation to proceed with some action.         |
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
	'text!templates/dialogs/confirm.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #ok': 'onClickOk',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				message: this.options.message,
				ok: this.options.ok,
				cancel: this.options.cancel
			});
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// dismiss modal dialog
			//
			Registry.application.modal.hide();

			// perform callback
			//
			if (this.options.accept) {
				return this.options.accept();
			}
		},

		onClickCancel: function() {

			// dismiss modal dialog
			//
			Registry.application.modal.hide();

			// perform callback
			//
			if (this.options.reject) {
				this.options.reject();
			}
		}
	});
});
