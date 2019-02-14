/******************************************************************************\
|                                                                              |
|                           new-package-profile-form-view.js                   |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'jquery.validate',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/packages/info/details/package-profile/new-package-profile-form.tpl',
	'config',
	'models/packages/package',
	'views/packages/info/versions/info/details/package-version-profile/new-package-version-profile-form-view',
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Template, Config, Package, NewPackageVersionProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newPackageVersionProfileForm: '#new-package-version-profile-form'
		},

		events: {
			'click input[name="file-source"]': 'onClickFileSource',
			'blur #external-url': 'onBlurExternalUrl'
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		initialize: function() {
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

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// display select tooltips on mouse over
			//
			this.$el.find('select').popover({
				trigger: 'focus'
			});

			// show package version profile form
			//
			this.newPackageVersionProfileForm.show(
				new NewPackageVersionProfileFormView({
					model: this.options.packageVersion,
					package: this.model,
					parent:	this
				})
			);

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
				}
			});
		},

		//
		// form methods
		//

		update: function(package, packageVersion) {

			// get values from form
			//
			var name = this.$el.find('#name input').val();
			var description = this.$el.find('#description textarea').val();
			var externalURL = this.useExternalUrl()? this.getExternalUrl(): null;

			// update model
			//
			package.set({
				'name': name,
				'description': description,
				'external_url': externalURL
			});

			// update version
			//
			this.newPackageVersionProfileForm.currentView.update(packageVersion);
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
