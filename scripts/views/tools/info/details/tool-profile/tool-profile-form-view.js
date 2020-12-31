/******************************************************************************\
|                                                                              |
|                          tool-profile-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a tool's profile info.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/info/details/tool-profile/tool-profile-form.tpl',
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
				name: this.$el.find('#name').val()
			};
		}
	});
});