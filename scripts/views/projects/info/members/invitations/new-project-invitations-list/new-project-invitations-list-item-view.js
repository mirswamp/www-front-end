/******************************************************************************\
|                                                                              |
|                   new-project-invitations-list-item-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list a user project invitations.     |
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
	'jquery.validate.bootstrap',
	'text!templates/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list-item.tpl',
	'models/users/user',
	'models/projects/project-invitation',
	'views/collections/tables/table-list-item-view',
], function($, _, Validate, Template, User, ProjectInvitation, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #add': 'onClickAdd',
			'click .delete button': 'onClickDelete'
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			// Custom validation method for class based rule
			//
			$.validator.addMethod('emailRequired', $.validator.methods.required, "Email Required");
			$.validator.addMethod('nameRequired', $.validator.methods.required, "Name Required");
			$.validator.addClassRules({
				'email': {
					emailRequired: true
				},
				'name': {
					nameRequired: true
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				model: this.model,
				showDelete: this.options.showDelete
			};
		},

		onRender: function() {
			this.validate();
		},

		//
		// form validation methods
		//

		getValues: function() {
			return {
				'invitee_name': this.$el.find('.name input').val(),
				'invitee_email': this.$el.find('.email input').val(),
				'invitee_username': this.$el.find('.username input').val()
			};
		},

		validate: function() {
			this.validator = this.$el.find('form').validate();
		},

		isValid: function() {
			if (this.validator) {
				return this.validator.form();
			} else {
				return true;
			}
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;
			var message;

			if (this.model.has('invitee_name')) {
				message = "Are you sure you want to delete the invitation of " + this.model.get('invitee_name') + " to the project, " + this.options.project.get('full_name') + "?";
			} else {
				message = "Are you sure you want to delete this invitation to the project, " + this.options.project.get('full_name') + "?";
			}

			// show confirmation
			//
			application.confirm({
				title: "Delete New Project Invitation",
				message: message,

				// callbacks
				//
				accept: function() {
					self.model.destroy();
				}
			});
		}
	});
});
