/******************************************************************************\
|                                                                              |
|                        new-tool-profile-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a new tool's profile info.           |
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
	'text!templates/tools/info/details/tool-profile/new-tool-profile-form.tpl',
	'views/forms/form-view',
	'views/tools/info/versions/tool-version/tool-version-profile/new-tool-version-profile-form-view'
], function($, _, Template, FormView, NewToolVersionProfileFormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-tool-version-profile-form'
		},

		//
		// form attributes
		//

		rules: {
			'name': {
				required: true,
				validToolName: true
			}
		},

		//
		// constructor
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

		templateContext: function() {
			return {
				model: this.model
			};
		},

		onRender: function() {

			// show child views
			//
			this.showChildView('form', new NewToolVersionProfileFormView({
				model: this.options.toolVersion
			}));

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// form methods
		//

		getValues: function() {
			return {
				name: this.$el.find('#name').val()
			};
		},

		applyTo: function(model, version) {

			// update model
			//
			model.set(this.getValues());

			// update version
			//
			this.getChildView('form').applyTo(version);
		}
	});
});
