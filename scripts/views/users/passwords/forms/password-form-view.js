/******************************************************************************\
|                                                                              |
|                            password-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering password info.                       |
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
	'text!templates/users/passwords/forms/password-form.tpl',
	'views/forms/form-view'
], function($, _, Template, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'input input': 'onChange'
		},

		//
		// form methods
		//

		getValues: function() {
			return {
				'label': this.$el.find('#password-label input').val()
			};
		},

		//
		// event handling methods
		//

		onChange: function() {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});
