/******************************************************************************\
|                                                                              |
|                        permission-comment-form-view.js                       |
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
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
	'text!templates/users/permissions/forms/permission-comment-form.tpl',
	'views/widgets/lists/key-value-list/key-value-list-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Validate, Registry, Template, KeyValueListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			policyForm: '#policy-form',
			commentForm: '#comment-form',
			userData: '#user-data'
		},

		events: {
			'input input': 'onChange',
			'input textarea': 'onChange',
			'click input[type="checkbox"]': 'onChange'
		},

		//
		// querying methods
		//

		getData: function() {
			return {
				comment: this.$el.find("#comment").val()
			};
		},

		//
		// rendering methods
		//

		template: function(data) {
			var isAdmin = Registry.application.session.user.isAdmin();
			return _.template(Template, _.extend(data, {
				policy: !isAdmin? this.model.get('policy') : null,
				showUserJustification: this.options.changeUserPermissions,
				showUserData: isAdmin,
				showComment: true
			}));
		},

		onRender: function() {

			// show subviews
			//
			if (this.model.has('meta_information')) {
				this.showUserData();
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

		showUserData: function() {
			this.userData.show(
				new KeyValueListView({
					array: this.model.get('meta_information'),
					editable: false,
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
		// validation methods
		//

		isValid: function() {
			return this.validator.form();
		},

		validate: function() {

			// validate policy form
			//
			this.validator = this.$el.find('form').validate({
				rules: {
					'accept_policy': {
						required: true
					}
				}
			});
		},

		//
		// event handling methods
		//

		onChange: function(event) {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});
