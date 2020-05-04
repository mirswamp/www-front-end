/******************************************************************************\
|                                                                              |
|                      permission-comment-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box used to prompt the user for a comment.      |
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
	'text!templates/users/accounts/permissions/dialogs/permission-comment-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/users/accounts/permissions/forms/permission-comment-form-view'
], function($, _, Template, DialogView, PermissionCommentFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#permission-comment-form',
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				permission: this.options.permission
			};
		},

		onRender: function() {

			// show subviews
			//
			this.showPermissionCommentForm();
		},

		showPermissionCommentForm: function() {
			var self = this;
			this.showChildView('form', new PermissionCommentFormView({
				model: this.options.permission,
				changeUserPermissions: this.options.changeUserPermissions,

				// callbacks
				//
				onChange: function() {
					if (self.getChildView('form').isValid()) {
						
						// enable button
						//
						self.$el.find('#ok').prop('disabled', false);
					} else {

						// disable button
						//
						self.$el.find('#ok').prop('disabled', true);
					}
				}
			}));
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickOk: function() {
			if (this.getChildView('form').isValid()) {
				this.getChildView('form').hideWarning();

				// perform callback
				//
				if (this.options.accept) {
					this.options.accept(this.getChildView('form').getValues());
				}
			} else {
				this.getChildView('form').showWarning();
			}
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		},

		onHide: function() {
			if (this.options.parent) {
				this.options.parent.render();
			}
		}
	});
});
