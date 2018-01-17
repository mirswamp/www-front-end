/******************************************************************************\
|                                                                              |
|                        new-project-invitations-list-view.js                  |
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'jquery.validate',
	'text!templates/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list.tpl',
	'registry',
	'models/users/user',
	'views/widgets/lists/table-list-view',
	'views/projects/info/members/invitations/new-project-invitations-list/new-project-invitations-list-item-view'
], function($, _, Backbone, Marionette, Validate, Template, Registry, User, TableListView, NewProjectInvitationsListItemView) {
	return TableListView.extend({

		//
		// attributes
		//

		childView: NewProjectInvitationsListItemView,

		events: {
			'blur input.email': 'onBlurEmail'
		},

		//
		// methods
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

			// call superclass method
			//
			TableListView.prototype.initialize.call(this);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				config: Registry.application.config,
				showDelete: this.options.showDelete
			}));
		},

		childViewOptions: function() {
			return {
				project: this.options.model,
				showDelete: this.options.showDelete
			}   
		},

		onRender: function() {
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// event handling methods
		//

		onBlurEmail: function(event) {
			var element = $(event.currentTarget);
			var email = event.currentTarget.value;
			if (email !== '' && email !== ' ') {

				// check for username uniqueness
				//
				var response = new User().checkValidation({
						'email': email
					}, {

					// callbacks
					//
					error: function() {
						console.info('ERROR');
						var error = JSON.parse(response.responseText)[0];
						error = error.substr(0,1).toUpperCase() + error.substr(1);
						element.closest('.control-group').removeClass('success').addClass('error');
						element.closest('.control-group').find('.error').removeClass('valid');
						element.closest('.control-group').find('label.error').html(error);
					}
				});
			}
		}
	});
});
