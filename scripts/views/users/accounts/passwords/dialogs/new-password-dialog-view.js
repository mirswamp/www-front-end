/******************************************************************************\
|                                                                              |
|                          new-password-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for creating new app passwords.             |
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
	'clipboard',
	'text!templates/users/accounts/passwords/dialogs/new-password-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Clipboard, Template, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #copy-to-clipboard': 'onClickCopyToClipboard'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				label: this.model.get('label'),
				password: this.model.get('password')
			};
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
			// application.sounds['double-click'].play();
		}
	});
});
