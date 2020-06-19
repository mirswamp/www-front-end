/******************************************************************************\
|                                                                              |
|                        new-package-version-details-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for setting a package versions's details.       |
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
	'bootstrap/popover',
	'text!templates/packages/info/versions/info/details/new-package-version-details.tpl',
	'views/base-view',
	'views/packages/info/versions/info/details/package-version-profile/new-package-version-profile-form-view'
], function($, _, Popover, Template, BaseView, NewPackageVersionProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-package-version-profile-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #next': 'onClickNext',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package: this.options.package
			};
		},

		onRender: function() {

			// display package version profile form view
			//
			this.showChildView('form', new NewPackageVersionProfileFormView({
				model: this.model,
				package: this.options.package,
				focusable: false
			}));

			// add popover
			//
			this.$el.find('#formats-supported').popover({
				'trigger': 'click',
				'placement': 'bottom'
			});
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// uploading methods
		//

		upload: function(options) {
			var data = this.getChildView('form').$el[0];

			// get data to upload
			//
			var formData = new FormData(data);

			// append pertinent model data
			//
			formData.append('package_uuid', this.options.package.get('package_uuid'));
			formData.append('user_uid', application.session.user.get('user_uid'));
			
			// append external url data
			//
			if (this.options.package.has('external_url')) {
				formData.append('use_external_url', this.options.package.has('external_url'));
			}
			if (this.model.has('checkout_argument')) {
				formData.append('checkout_argument', this.model.get('checkout_argument'));
			}

			// upload
			//
			this.model.upload(formData, options);
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickNext: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

				// upload model
				//
				this.upload({
					beforeSend: function(event) {
						self.showProgressBar();
					},

					onprogress: function(event) {
						if (event.lengthComputable) {
							var percentComplete = event.loaded / event.total;
							self.showProgressPercent(percentComplete);
						}
					},

					// callbacks
					//
					success: function(data) {

						// convert returned data to an object, if necessary
						//
						if (typeof(data) === 'string') {
							data = $.parseJSON(data);
						}

						// save path to version
						//
						self.model.set({
							'package_path': data.destination_path + '/' + data.filename
						});

						self.resetProgressBar();

						// show next view
						//
						self.options.parent.showSource();
					},

					error: function(response) {

						// show notification
						//
						application.notify({
							title: 'Package Upload Error',
							message: response.responseText || "This package could not be uploaded."
						});

						self.resetProgressBar();
					}
				});
			} else {

				// show warning
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to package view
			//
			application.navigate('#packages/' + this.options.package.get('package_uuid'));
		},

		//
		// progress bar handling methods
		//

		showProgressMessage: function(message) {
			this.$el.find('.bar-message').text(message);
		},

		showProgressBar: function() {

			// fadeTo instead of fadeOut to prevent display: none;
			//
			this.$el.find('.progress').fadeTo(0, 0.0);
			this.$el.find('.progress').removeClass('invisible');
			this.$el.find('.progress').fadeTo(1000, 1.0);

			switch (this.options.package.get('external_url_type')) {
				case 'download':
					this.showProgressMessage('Downloading archive...');
					break;
				case 'git':
					this.showProgressMessage("Cloning repository...");
					break;
				default:
					this.showProgressMessage("Uploading archive...");
					break;
			}
		},

		resetProgressBar: function() {
			this.$el.find('.bar').width('0%');
			this.$el.find('.bar-message').text('');
			this.$el.find('.progress').fadeTo(1000, 0.0);
		},

		showProgressPercent: function(progress) {
			if (progress > 0 && progress < 1) {
				var percentage = Math.ceil(progress * 100) + '%';
				this.$el.find('.bar').width(percentage);
				this.$el.find('.bar-percentage').text(percentage);
			}	
		}
	});
});
