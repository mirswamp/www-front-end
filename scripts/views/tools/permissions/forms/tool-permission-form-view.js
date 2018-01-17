/******************************************************************************\
|                                                                              |
|                          tool-permission-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box that is used to                       |
|        prompt the user for a comment to proceed with some action.            |
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
	'bootstrap/tooltip',
	'bootstrap/popover',
	'jquery.validate',
	'registry',
	'text!templates/tools/permissions/forms/tool-permission-form.tpl'
], function($, _, Backbone, Marionette, Tooltip, Popover, Validate, Registry, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'input input': 'onChange',
			'input textarea': 'onChange',
			'click input[type="checkbox"]': 'onChange'
		},

		//
		// methods
		//

		initialize: function(){
			$.validator.addMethod('url', function(value) {
				var re = /^http|https:\/\//;
				return re.test( value.toLowerCase() );
			}, "Not a valid URL.");
		},

		//
		// query methods
		//

		getData: function() {
			var data = {};
			var userInfo = this.model.get('user_info');

			if (userInfo) {
				for (var key in userInfo) {
					var id = key.replace(' ', '-');
					switch (userInfo[key].type) {

						case 'text':
							data[key] = this.$el.find('#' + id + ' input').val();
							break;

						case 'enum':
							data[key] = this.$el.find('#' + id + ' input:radio:checked').val()
							break;
					}
				}
			}

			return data;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			this.$el.find('input, textarea').on('hidden', function (event) {
				event.stopPropagation();
			});

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		isValid: function() {
			return this.validator.form();
		},

		validate: function() {
			return this.$el.find('form').validate({
				rules: {
					'name': {
						required: true,
					},
					'email': {
						required: true,
						email: true
					},
					'organization': {
						required: true,
					},
					'url': {
						required: true,
						url: true
					},
					'user-type': {
						required: true,
					},
					'confirm': {
						required: true
					}
				}
			});
		},

		//
		// event handling methods
		//

		onChange: function(event) {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});

