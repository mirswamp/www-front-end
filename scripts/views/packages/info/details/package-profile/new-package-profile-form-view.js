/******************************************************************************\
|                                                                              |
|                       new-package-profile-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a new package's profile info.        |
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
	'text!templates/packages/info/details/package-profile/new-package-profile-form.tpl',
	'models/packages/package',
	'views/forms/form-view',
	'views/packages/info/versions/info/details/package-version-profile/new-package-version-profile-form-view',
], function($, _, Template, Package, FormView, NewPackageVersionProfileFormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-package-version-profile-form'
		},

		events: {
			'click input[name="file-source"]': 'onClickFileSource',
			'blur #external-url': 'onBlurExternalUrl'
		},

		//
		// form attributes
		//
		
		rules: {
			'name': {
				required: true
			},
			'file': {
				file: true
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
		// querying methods
		//

		useExternalUrl: function() {
			return this.$el.find('input[value="use-external-url"]').is(':checked') ||
				this.$el.find('input[value="use-external-git-url"]').is(':checked');
		},

		useExternalGitUrl: function() {
			return this.$el.find('input[value="use-external-git-url"]').is(':checked');
		},

		getExternalUrl: function() {
			if (!this.useExternalGitUrl()) {
				return this.$el.find('#external-url input').val();
			} else {
				return this.$el.find('#external-git-url input').val();
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
			this.showChildView('form', new NewPackageVersionProfileFormView({
				model: this.options.packageVersion,
				package: this.model,
				parent:	this
			}));

			// display select tooltips on mouse over
			//
			this.$el.find('select').popover({
				trigger: 'focus'
			});

			this.addValidators();

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
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
				return (value != '') || (self.$el.find('#external-url').val() != '');
			}, "Please select an archive file.");
		},

		getValues: function() {
			return {
				'name': this.$el.find('#name input').val(),
				'description': this.$el.find('#description textarea').val(),
				'external_url': this.useExternalUrl()? this.getExternalUrl(): null
			};
		},

		//
		// event handling methods
		//

		onClickFileSource: function(event) {
			var source = $(event.target).val();
			switch (source) {
				case 'use-local-file':
					this.$el.find('#git-message').hide();
					this.$el.find('#external-url').hide();
					this.$el.find('#external-git-url').hide();
					this.$el.find('#webhook-callback').hide();
					this.$el.find('#checkout-argument').hide();
					this.$el.parent().find('#file').show();
					break;
				case 'use-external-url':
					this.$el.find('#git-message').hide();
					this.$el.find('#external-url').show();
					this.$el.find('#external-git-url').hide();
					this.$el.find('#webhook-callback').hide();
					this.$el.find('#checkout-argument').hide();
					this.$el.parent().find('#file').hide();
					break;
				case 'use-external-git-url':
					this.$el.find('#git-message').show();
					this.$el.find('#external-url').hide();
					this.$el.find('#external-git-url').show();
					this.$el.find('#webhook-callback').show();
					this.$el.find('#checkout-argument').show();
					this.$el.parent().find('#file').hide();
					break;
			}
		},

		onBlurExternalUrl: function() {
			if (this.$el.find('#external-url').val() != '') {
				this.$el.find('#archive').val('');
			}
		},
	});
});
