/******************************************************************************\
|                                                                              |
|                       new-tool-version-profile-form-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a new tool versions's           |
|        profile information.                                                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'jquery.validate',
	'text!templates/tools/info/versions/tool-version/tool-version-profile/new-tool-version-profile-form.tpl',
	'views/tools/info/versions/tool-version/tool-version-profile/tool-version-profile-form-view'
], function($, _, Backbone, Marionette, Validate, Template, ToolVersionProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			toolVersionProfileForm: '#tool-version-profile-form'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {

			// show subview
			//
			this.toolVersionProfileForm.show(
				new ToolVersionProfileFormView({
					model: this.model
				})
			);

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
				}
			});
		},

		isValid: function() {
			return this.validator.form() && this.toolVersionProfileForm.currentView.isValid();
		},

		//
		// form methods
		//

		update: function(model) {
			this.toolVersionProfileForm.currentView.update(model);
		}
	});
});