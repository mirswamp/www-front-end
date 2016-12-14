/******************************************************************************\
|                                                                              |
|                       new-package-version-profile-form-view.js               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a package versions's profile information.      |
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
	'registry',
	'text!templates/packages/info/versions/info/details/package-version-profile/new-package-version-profile-form.tpl',
	'views/packages/info/versions/info/details/package-version-profile/package-version-profile-form-view',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, Validate, Tooltip, Popover, Registry, Template, PackageVersionProfileFormView, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageVersionProfileForm: '#package-version-profile-form'
		},

		events: {
			'click #archive': 'onClickArchive',
			'click #use-external-url': 'onClickUseExternalUrl'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// add external url validation rule
			//
			$.validator.addMethod('archive', function(value) {
				if (self.options.package.hasValidExternalUrl()) {
					if (self.$el.find('#use-external-url').length > 0) {
						if (self.$el.find('#use-external-url').is(':checked') ){
							return true;
						}
					} else {
						return true;
					}
				}
				var fileName = self.model.getFilenameFromPath(value);
				return self.model.isAllowedFilename(fileName);
			}, function( params, element ){
				if (self.$el.find('#use-external-url').length > 0) {
					if (!self.$el.find('#use-external-url').is(':checked')) {
						if ($(element).val()) {
							return "This file is not a recognized archive file format.";
						} else {
							return "This field is required.";
						}
					}
				}

				return $(element).val() ? "This file is not a recognized archive file format." : "This field is required.";
			});

			// add file validation rule
			//
			$.validator.addMethod('file', function(value) {
				return (value != '' && self.model.isAllowedFilename(value)) || (self.hasExternalUrl() && self.getExternalUrl() != '') || self.useExternalUrl();
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
			return this.$el.find('#use-external-url').is(':checked');
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

			// show package version profile form
			//
			this.packageVersionProfileForm.show(
				new PackageVersionProfileFormView({
					model: this.model,
					package: this.options.package
				})
			);

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// display archive file tooltips on mouse over
			//
			this.$el.find("input[type='file']").popover({
				trigger: 'hover'
			});

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {

			// validate package version profile form
			//
			this.packageVersionProfileForm.currentView.validate({
				rules: {
					"use_external_url": {
						url: true
					},
					'file': {
						file: true
					},
				},
			});

			// validate form
			//
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

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
				Registry.application.modal.show( new NotifyView({
					title: 'No File Required',
					message: message
				}));
			}
		},

		onClickUseExternalUrl: function() {
			this.$el.find('#archive').val('');
		},

		update: function(model) {
			this.packageVersionProfileForm.currentView.update(model);
		}
	});
});
