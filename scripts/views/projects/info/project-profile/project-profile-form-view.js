/******************************************************************************\
|                                                                              |
|                               project-profile-form.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a project's profile             |
|        information.                                                          |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/projects/info/project-profile/project-profile-form.tpl',
	'registry',
	'models/users/user',
	'models/projects/project',
	'collections/tools/tools'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Registry, User, Project, Tools) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click .project-type': 'onClickProjectType'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;
			this.projectOwner = new User({
				'user_uid': this.model.get('project_owner_uid')
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				Project: Project
			}));
		},

		onRender: function() {
			var self = this;

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// show tool owner options, if necessary
			//
			Tools.fetchNumByUser(Registry.application.session.user, {
				success: function(number) {
					if (number > 0) {
						self.$el.find(".tool-owner-options").show();

						// uncheck use public tools for new tools
						//
						if (self.model.isNew()) {
							self.$el.find("#use-public-tools").prop('checked', false);
						}
					} else {
						self.$el.find(".tool-owner-options").hide();
					}
				}
			});

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'description': {
						required: true
					}
				},
				messages: {
					'description': {
						required: "Please provide a short description of your project."
					}
				}
			});
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(model) {

			// get values from form
			//
			var fullName = this.$el.find('#full-name').val();
			var shortName = this.$el.find('#short-name').val();
			var description = this.$el.find('#description').val();
			var viewer = this.$el.find('#viewer').val();
			var usePublicTools = this.$el.find('#use-public-tools').is(':checked');

			// update model
			//
			model.set({
				'full_name': fullName,
				'short_name': shortName,
				'description': description,
				'viewer_uuid': viewer,
				'exclude_public_tools_flag': usePublicTools? 0 : 1
			});
		},

		//
		// event handling methods
		//

		onClickProjectType: function(event) {
			var projectTypeCode = $(event.currentTarget).attr('id');
			this.model.set({
				'project_type_code': projectTypeCode
			});
		}
	});
});
