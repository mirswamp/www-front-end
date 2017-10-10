/******************************************************************************\
|                                                                              |
|                          permission-comment-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box that is used to                       |
|        prompt the user for a comment to proceed with some action.            |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'jquery.validate',
	'registry',
	'text!templates/users/permissions/dialogs/permission-comment.tpl',
	'views/users/permissions/forms/permission-comment-form-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Validate, Registry, Template, PermissionCommentFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			permissionCommentForm: '#permission-comment-form',
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				permission: this.options.permission
			}));
		},

		onRender: function() {

			// show subviews
			//
			this.showPermissionCommentForm();
		},

		showPermissionCommentForm: function() {
			var self = this;
			this.permissionCommentForm.show(
				new PermissionCommentFormView({
					model: this.options.permission,
					changeUserPermissions: this.options.changeUserPermissions,

					// callbacks
					//
					onChange: function() {
						if (self.permissionCommentForm.currentView.isValid()) {
							
							// enable button
							//
							self.$el.find('#ok').prop('disabled', false);
						} else {

							// disable button
							//
							self.$el.find('#ok').prop('disabled', true);
						}
					}
				})
			);
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickOk: function() {
			this.permissionCommentForm.currentView.validate();
			if (this.permissionCommentForm.currentView.isValid()) {
				this.hideWarning();

				// perform callback
				//
				if (this.options.accept) {
					this.options.accept(this.permissionCommentForm.currentView.getData())
				}
			} else {
				this.showWarning();
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
