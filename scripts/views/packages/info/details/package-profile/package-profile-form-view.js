/******************************************************************************\
|                                                                              |
|                         package-profile-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a package's  profile info.           |
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
	'config',
	'text!templates/packages/info/details/package-profile/package-profile-form.tpl',
	'views/forms/form-view',
	'utilities/web/address-bar'
], function($, _, Config, Template, FormView, AddressBar) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'focus #language-type': 'onFocusLanguageType',
			'change #language-type': 'onChangeLanguageType',
			'click #generate-token': 'onClickGenerateToken'
		},

		//
		// form attributes
		//
		
		rules: {
			'name': {
				required: true
			},
			'external-url': {
				url: true
			}
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			$.validator.addMethod('external-url', function(value) {
				self.model.set('external_url', value);
				if (value === '') {
					return true;
				}
				if (self.model.hasValidExternalUrl()) {
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
				case 'java':
					return this.getJavaType();
				case 'python':
					return this.getPythonType();
				case 'ruby':
					return 'ruby';
			}
		},

		getSecretToken: function() {
			return this.$el.find('#secret-token input').val();
		},

		getSuggestedSecretToken: function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		},

		getPayloadUrl: function() {
			var url = Config.servers.web + '/packages/github';

			if (url.startsWith('/')) {
				return AddressBar.get('base') + url.substring(1);
			} else {
				return url;
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				payload_url: this.getPayloadUrl(),
				suggested_secret_token: this.getSuggestedSecretToken()
			};
		},

		showLanguageType: function() {
			
			// show / hide java type
			//
			if (this.getLanguageType() == 'java') {
				this.$el.find('#java-type').show();
			} else {
				this.$el.find('#java-type').hide();
			}
		},

		//
		// form methods
		//

		getValues: function() {
			return {
				'name': this.$el.find('#name input').val(),
				'description': this.$el.find('#description textarea').val(),
				'external_url': this.$el.find('#external-url input').val(),
				'secret_token': this.$el.find('#secret-token input').val()
			};
		},

		applyTo: function(package) {

			// update model
			//
			package.set(this.getValues());

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
			this.showLanguageType();
		},

		onClickGenerateToken: function() {
			var secretToken = this.getSuggestedSecretToken();
			this.$el.find('#secret-token input').val(secretToken);
			this.$el.find('#secret-token input').trigger('change');
		}
	});
});