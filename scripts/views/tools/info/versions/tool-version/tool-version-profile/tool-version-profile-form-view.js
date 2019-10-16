/******************************************************************************\
|                                                                              |
|                       tool-version-profile-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a tool versions's profile info.      |
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
	'text!templates/tools/info/versions/tool-version/tool-version-profile/tool-version-profile-form.tpl',
	'views/forms/form-view'
], function($, _, Template, FormView) {
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
				required: true
			}
		},

		messages: {
			'description': {
				required: "Please provide a short description of your tool."
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
		},

		//
		// form methods
		//

		getValues: function() {
			return {
				version_string: this.$el.find('#version-string').val(),
				tool_directory: this.$el.find('#tool-directory').val(),

				// execution params
				//
				tool_executable:  this.$el.find('#tool-executable').val(),
				tool_arguments: this.$el.find('#tool-arguments').val(),

				// version notes
				//
				notes: this.$el.find('#notes').val()
			};
		}
	});
});