/******************************************************************************\
|                                                                              |
|                            new-tool-profile-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a tool's profile                |
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
	'text!templates/tools/info/details/tool-profile/new-tool-profile-form.tpl',
	'views/tools/info/versions/tool-version/tool-version-profile/new-tool-version-profile-form-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, NewToolVersionProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newToolVersionProfileForm: '#new-tool-version-profile-form'
		},

		//
		// methods
		//

		initialize: function() {

			// add tool name validation
			//
			$.validator.addMethod('validToolName', function() {

				// check to make sure that tool name is unique
				//
				return true;
				
			}, "Tool name must be unique.");
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

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// validate the form
			//
			this.validator = this.validate();

			// show tool version profile form
			//
			this.newToolVersionProfileForm.show(
				new NewToolVersionProfileFormView({
					model: this.options.toolVersion
				})
			);
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'name': {
						required: true,
						validToolName: true
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

		update: function(model, version) {

			// get values from form
			//
			var name = this.$el.find('#name').val();

			// update model
			//
			model.set({
				'name': name
			});

			// update version
			//
			this.newToolVersionProfileForm.currentView.update(version);
		}
	});
});
