/******************************************************************************\
|                                                                              |
|                            progress-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification dialog that is used to show a             |
|        progress dialog box.                                                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|         Copyright (C) 2016-2020, Megahed Labs LLC, www.sharedigm.com         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/dialogs/progress-dialog.tpl',
	'views/dialogs/dialog-view'
], function($, _, Template, DialogView) {
	'use strict';

	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: _.extend({}, DialogView.prototype.events, {
			'click .cancel': 'onClickCancel'
		}),

		//
		// dialog attributes
		//

		resizable: false,
		minimizable: true,
		maximizable: false,
		closeable: false,

		//
		// methods
		//

		setMessage: function(amount) {
			this.$el.find('.message').html(amount);
		},

		setAmount: function(amount) {
			this.$el.find('.amount').html(amount);
		},

		setPercent: function(percent) {
			this.$el.find('.progress .bar').css('width', percent + '%');
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				icon: this.options.icon,
				title: this.options.title,
				amount: this.options.amount,
				message: this.options.message,
				cancelable: this.options.cancelable
			};
		},

		//
		// event handling methods
		//

		onClickCancel: function() {
			if (this.options.cancel) {
				this.options.cancel();
			}	
			this.hide();
		}
	});
});
