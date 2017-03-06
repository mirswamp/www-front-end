/******************************************************************************\
|                                                                              |
|                                credits-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal credits dialog box.                                             |
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
	'text!templates/dialogs/credits.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				message: this.options.message
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
				this.options.accept();
			}
		}
	});
});
