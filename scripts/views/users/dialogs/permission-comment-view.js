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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tooltip',
	'popover',
	'validate',
	'registry',
	'text!templates/users/dialogs/permission-comment.tpl',
	'views/users/info/permissions/forms/tool-permission-form-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Validate, Registry, Template, ToolPermissionFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			policyForm: '#policy-form',
			toolForm: '#tool-form',
			commentForm: '#comment-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click input:radio[name=user-type]': 'onClickInputUserType',
			'click #ok': 'onClickOk',
			'click #cancel': 'onClickCancel',
			'keypress': 'onKeyPress'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				changeUserPermissions: this.options.changeUserPermissions,
				title: this.options.permission.get('title'),
				permission_code: this.options.permission.get('permission_code'),
				user_comment: this.options.permission.get('user_comment'),
				meta_information: this.options.permission.get('meta_information'),
				message: this.options.permission.get('message'),
				status: this.options.permission.get('status'),
				policy: this.options.permission.get('policy'),
				ok: this.options.ok,
				cancel: this.options.cancel
			});
		},

		onRender: function() {

			// hide user type specific content
			//
			this.$el.find('div[name=user-type]').hide();

			// show tool form
			//
			if (!this.options.changeUserPermissions) {
				switch( this.options.permission.get('permission_code')) {
					case 'parasoft-user-c-test':
					case 'parasoft-user-j-test':
					case 'parasoft-user-j-test':
					case 'red-lizard-user':
					case 'codesonar':
						this.toolForm.show(new ToolPermissionFormView({
							parent: this
						}));
					break;
				}
			}

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate the form
			//
			this.validate();
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// validation methods
		//

		isValid: function() {
			var valid = true;

			// check policy form
			//
			if (!this.policyValidator.form()) {
				valid = false;
			}

			// check tool form
			//
			if (this.toolForm.currentView) {
				if (!this.toolForm.currentView.isValid()) {
					valid = false;
				}
			}

			// check comment form
			//
			if (!this.commentValidator.form()) {
				valid = false;
			}

			return valid;
		},

		validate: function() {

			// validate policy form
			//
			this.policyValidator = this.$el.find('#policy-form form').validate({
				rules: {
					'accept_policy': {
						required: true
					}
				}
			});

			// validate comment form
			//
			this.commentValidator = this.$el.find('#comment-form form').validate({
				rules: {
				}
			});
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},
		
		onClickInputUserType: function(event) {
			var idName = $(event.target).attr('id');

			// hide user type specific content
			//
			this.$el.find('div[name=user-type]').hide();

			// show content for specific user type
			//
			this.$el.find('div.' + idName).show();		
		},

		onClickOk: function() {

			// hide errors
			//
			this.$el.find('.errors').hide();

			// validate form
			//
			var valid = this.isValid();
			if (this.toolForm && this.toolForm.currentView) {
				valid = (valid === true) && (this.toolForm.currentView.isValid() === true);
			}

			// return form info
			//
			if (valid && this.options.accept) {
				if (this.toolForm && this.toolForm.currentView && this.toolForm.currentView.getData) {
					return this.options.accept(_.extend(this.toolForm.currentView.getData(), {
						comment: this.$el.find("#comment").val()
					}));
				} else {
					return this.options.accept({
						comment: this.$el.find("#comment").val()
					});
				}
			} else {

				// show warning
				//
				this.showWarning();
				return false;
			}
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		},

		onKeyPress: function(event) {
	        if (event.keyCode === 13)
	            this.onClickOk();
		},

		onHide: function() {
			if( this.options.parent )
				this.options.parent.render();
		}
	});
});
