/******************************************************************************\
|                                                                              |
|                   new-package-version-profile-form-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a new package versions's             |
|        profile info.                                                         |
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
	'text!templates/packages/info/versions/info/details/package-version-profile/new-package-version-profile-form.tpl',
	'models/packages/package',
	'views/forms/form-view',
	'views/packages/info/versions/info/details/package-version-profile/package-version-profile-form-view',
], function($, _, Template, Package, FormView, PackageVersionProfileFormView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-version-profile-form'
		},

		events: {
			'click input[name="file-source"]': 'onClickFileSource',
			'click #archive': 'onClickArchive'
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			// add external url validation rule
			//
			$.validator.addMethod('archive', function(value) {
				if (!self.useExternalUrl() && !self.hasValidFilename()) {
					return "This file is not a recognized archive file format.";
				}
				return true;
			});

			// add file validation rule
			//
			$.validator.addMethod('file', function(value) {

				// check if we are using external url
				//
				if ((self.hasExternalUrl() && self.getExternalUrl() != '') || self.useExternalUrl()) {
					return true;
				}

				// check filename
				//
				return value != '' && Package.isValidArchiveName(value);
			}, "Please select an archive file.");
		},

		//
		// querying methods
		//

		hasExternalUrl: function() {
			return this.$el.closest('form').find('#external-url').length != 0;
		},

		getExternalUrl: function() {
			return this.$el.closest('form').find('#external-url').val();
		},

		useExternalUrl: function() {
			return this.$el.find('input[value="use-external-url"]').is(':checked');
		},

		hasValidFilename: function() {
			var fileName = this.model.getFilenameFromPath(value);
			return Package.protoype.isValidArchiveName(fileName);
		},
		
		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				package: this.options.package
			};
		},

		onRender: function() {

			// show child views
			//
			this.showChildView('form', new PackageVersionProfileFormView({
				model: this.model,
				package: this.options.package
			}));

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		//
		// form validation methods
		//

		validate: function() {

			// call superclass method
			//
			FormView.prototype.validate.call(this);

			// validate new package version profile form
			//
			this.getChildView('form').validate();
		},

		isValid: function() {
			return FormView.prototype.isValid.call(this) && this.getChildView('form').isValid();
		},
		
		//
		// form methods
		//

		onClickFileSource: function(event) {
			var source = $(event.target).val();
			switch (source) {
				case 'use-local-file':
					this.$el.find('#external-url').hide();
					this.$el.find('#external-git-url').hide();
					this.$el.find('#git-message').hide();
					this.$el.find('#checkout-argument').hide();
					this.$el.parent().find('#file').show();
					break;
				case 'use-external-url':
					this.$el.find('#external-url').show();
					this.$el.find('#external-git-url').hide();
					this.$el.find('#git-message').hide();
					this.$el.find('#checkout-argument').hide();
					this.$el.parent().find('#file').hide();
					break;
				case 'use-git-url':
					this.$el.find('#external-url').hide();
					this.$el.find('#external-git-url').show();
					this.$el.find('#git-message').show();
					this.$el.find('#checkout-argument').show();
					this.$el.parent().find('#file').hide();
					break;
			}
		},

		onClickArchive: function(event) {
			var self = this;

			// check to see if an external url was already specified
			//
			if (this.hasExternalUrl() && self.getExternalUrl() != '' || this.useExternalUrl()) {
				var message = 'No file required. You have already provided a valid URL from which to retrieve your code. If you wish to upload an archive instead, please clear the External URL field first.';
				if (self.$el.find('#use-external-url').length > 0) {
					message = 'No file required. You have selected to retrieve your code from the External URL. If you wish to upload an archive instead, please clear the checkbox to use the External URL.';
				}

				event.preventDefault();

				// show notification
				//
				application.notify({
					title: 'No File Required',
					message: message
				});
			}
		},

		getValues: function() {
			var values = this.getChildView('form').getValues();
			var checkoutArgument = this.$el.find('#checkout-argument input').val();
			
			return _.extend(values, {
				'checkout_argument': checkoutArgument != ''? checkoutArgument : null
			});
		}
	});
});
