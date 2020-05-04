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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'text!templates/packages/info/details/package-profile/package-profile-form.tpl',
	'models/packages/package',
	'views/forms/form-view',
	'utilities/web/address-bar'
], function($, _, Config, Template, Package, FormView, AddressBar) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'focus #language-type': 'onFocusLanguageType',
			'change #language-type': 'onChangeLanguageType',
			'click input[name="file-source"]': 'onClickFileSource',
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
				url: true,
				external_url: true
			},
			'external-git-url': {
				url: true,
				external_git_url: true
			}
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

		getFileSource: function() {
			return this.$el.find('input[name="file-source"]:checked').val();
		},

		getExternalUrl: function() {
			return this.$el.find('#external-url input').val();
		},

		getExternalGitUrl: function() {
			return this.$el.find('#external-git-url input').val();
		},

		getPayloadUrl: function() {
			var url = Config.servers.web + '/packages/github';

			if (url.startsWith('/')) {
				return AddressBar.get('base') + url.substring(1);
			} else {
				return url;
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

		onRender: function() {

			// add form validation methods
			//
			this.addValidators();

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
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

		addValidators: function() {
			var self = this;

			// add external url validation rule
			//
			$.validator.addMethod('external_url', function(value) {
				return Package.isValidArchiveName(value);
			}, "Not a valid external archive URL.");

			$.validator.addMethod('external_git_url', function(value) {
				return Package.isValidGitUrl(value);
			}, "Not a valid GitHub HTTPS URL.");

			// add file validation rule
			//
			$.validator.addMethod('file', function(value) {
				return Package.isValidArchiveName(value) || (self.$el.find('#external-url').val() != '');
			}, "Please select an archive file.");

			$.validator.addMethod('selectcheck', function (value) {
				return (value != 'none');
			}, "Please specify the package's programming language.");
		},

		getValues: function() {
			return {
				'name': this.$el.find('#name input').val(),
				'description': this.$el.find('#description textarea').val(),
				'external_url_type': this.getFileSource() != 'local'? this.getFileSource() : '',
				'external_url': this.getFileSource() != 'local'? (this.getFileSource() == 'git'? this.getExternalGitUrl(): this.getExternalUrl()) : '',
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

		onClickFileSource: function(event) {
			var source = $(event.target).val();
			switch (source) {

				case 'local':
					this.$el.find('#external-url').hide();
					this.$el.find('#external-git-url').hide();
					this.$el.find('#git-message').hide();
					this.$el.find('#webhook-callback').hide();
					break;

				case 'download':
					this.$el.find('#external-url').show();
					this.$el.find('#external-git-url').hide();
					this.$el.find('#git-message').hide();
					this.$el.find('#webhook-callback').hide();
					break;

				case 'git':
					this.$el.find('#external-url').hide();
					this.$el.find('#external-git-url').show();
					this.$el.find('#git-message').show();
					this.$el.find('#webhook-callback').show();
					break;
			}
		},

		onClickGenerateToken: function() {
			var secretToken = this.getSuggestedSecretToken();
			this.$el.find('#secret-token input').val(secretToken);
			this.$el.find('#secret-token input').trigger('change');
		}
	});
});