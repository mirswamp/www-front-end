/******************************************************************************\
|                                                                              |
|                             package-profile-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a package's profile             |
|        information.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'validate',
	'tooltip',
	'popover',
	'text!templates/packages/info/details/package-profile/package-profile-form.tpl'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'focus #language-type': 'onFocusLanguageType',
			'change #language-type': 'onChangeLanguageType'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			$.validator.addMethod('external-url', function(value) {
				self.model.set('external_url', value);
				if( value === '' ){
					return true;
				}
				if( self.model.hasValidExternalUrl() ){
					var file = $(document).find('#archive').val('');
					return true;
				}
				return false;
			}, "Not a valid external URL.");

			jQuery.validator.addMethod('selectcheck', function (value) {
				return (value != 'none');
			}, "Please specify the package's programming language.");
		},

		//
		// query methods
		//

		getLanguageTypeId: function() {
			return this.$el.find('#language-type')[0].selectedIndex;
		},

		getLanguageType: function() {
			var index = this.getLanguageTypeId();
			var selector = this.$el.find('#language-type')[0];
			return selector.options[index].value;
		},

		getJavaType: function() {
			return this.$el.find('input:radio[name=java-type]:checked').val();
		},

		getPythonType: function() {
			return this.$el.find('input:radio[name=python-type]:checked').val();
		},

		getPackageType: function() {
			switch (this.getLanguageType()) {
				case 'c':
					return 'c-source';
					break;
				case 'java':
					return this.getJavaType();
					break;
				case 'python':
					return this.getPythonType();
					break;
				case 'ruby':
					return 'ruby';
					break;
			}
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

			// validate form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(package) {

			// get values from form
			//
			var name = this.$el.find('#name').val();
			var description = this.$el.find('#description').val();
			var external_url = this.$el.find('#external-url').val();

			// update model
			//
			package.set({
				'name': name,
				'description': description,
				'external_url': external_url
			});

			// update package type, if shown
			//
			if (this.model.get('package_type_id') == undefined) {
				package.set({
					'package_type_id': Package.toPackageTypeId(this.getPackageType())
				});
			}
		},

		//
		// event handling methods
		//

		onFocusLanguageType: function() {

			// remove empty menu item
			//
			if (this.$el.find("#language-type option[value='none']").length !== 0) {
				this.$el.find("#language-type option[value='none']").remove();
			}
		},

		onChangeLanguageType: function() {

			// show / hide java type
			//
			if (this.getLanguageType() == 'java') {
				this.$el.find('#java-type').show();
			} else {
				this.$el.find('#java-type').hide();
			}
		}
	});
});