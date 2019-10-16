/******************************************************************************\
|                                                                              |
|                         tool-permission-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering tool permissions info.               |
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
	'text!templates/tools/permissions/forms/tool-permission-form.tpl',
	'views/forms/form-view'
], function($, _, Template, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		events: {
			'input input': 'onChange',
			'input textarea': 'onChange',
			'click input[type="checkbox"]': 'onChange'
		},

		//
		// form attributes
		//

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
		},

		//
		// constructor
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

		onRender: function() {
			this.$el.find('input, textarea').on('hidden', function (event) {
				event.stopPropagation();
			});

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
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

