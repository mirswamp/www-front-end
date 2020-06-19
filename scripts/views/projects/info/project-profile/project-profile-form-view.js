/******************************************************************************\
|                                                                              |
|                         project-profile-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a project's profile info.            |
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
	'text!templates/projects/info/project-profile/project-profile-form.tpl',
	'models/users/user',
	'models/projects/project',
	'collections/tools/tools',
	'views/forms/form-view'
], function($, _, Template, User, Project, Tools, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// form attributes
		//

		rules: {
			'description': {
				required: false
			}
		},

		messages: {
			'description': {
				required: "Please provide a short description of your project."
			}
		},

		//
		// constructor
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

		templateContext: function() {
			return {
				Project: Project
			};
		},

		onRender: function() {
			var self = this;

			// show tool owner options, if necessary
			//
			Tools.fetchNumByUser(application.session.user, {
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

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// form methods
		//

		getValues: function() {

			// get values from form
			//
			var name = this.$el.find('#name').val();
			var description = this.$el.find('#description').val();
			var viewer = this.$el.find('#viewer').val();
			var usePublicTools = this.$el.find('#use-public-tools').is(':checked');

			// return form values
			//
			return {
				'full_name': name,
				'description': description,
				'viewer_uuid': viewer,
				'exclude_public_tools_flag': usePublicTools? 0 : 1
			};
		}
	});
});
