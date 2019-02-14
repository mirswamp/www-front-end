/******************************************************************************\
|                                                                              |
|                               new-password-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box for displaing new application         |
|        passwords.                                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'clipboard',
	'text!templates/users/passwords/dialogs/new-password.tpl'
], function($, _, Backbone, Marionette, Registry, Clipboard, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #copy-to-clipboard': 'onClickCopyToClipboard'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			new Clipboard(this.$el.find('#copy-to-clipboard')[0]);
		},

		//
		// event handling methods
		//

		onClickCopyToClipboard: function() {

			// play sound
			//
			Registry.application.sounds['double-click'].play();
		}
	});
});
