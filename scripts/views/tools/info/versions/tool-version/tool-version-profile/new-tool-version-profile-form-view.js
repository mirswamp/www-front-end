/******************************************************************************\
|                                                                              |
|                    new-tool-version-profile-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a new tool versions's                |
|        profile info.                                                         |
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
	'text!templates/tools/info/versions/tool-version/tool-version-profile/new-tool-version-profile-form.tpl',
	'views/forms/form-view',
	'views/tools/info/versions/tool-version/tool-version-profile/tool-version-profile-form-view'
], function($, _, Template, FormView, ToolVersionProfileFormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#tool-version-profile-form'
		},

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

		onRender: function() {

			// show child views
			//
			this.showChildView('form', new ToolVersionProfileFormView({
				model: this.model
			}));

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// form validation methods
		//

		isValid: function() {
			return this.validator.form() && this.getChildView('form').isValid();
		},

		//
		// form methods
		//

		getValues: function() {
			return this.getChildView('form').getValues();
		}
	});
});