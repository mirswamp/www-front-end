/******************************************************************************\
|                                                                              |
|                            new-package-details-view.js                       |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/popover',
	'text!templates/packages/info/details/new-package-details.tpl',
	'views/base-view',
	'views/packages/info/details/package-profile/new-package-profile-form-view'
], function($, _, Popover, Template, BaseView, NewPackageProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-package-profile-form'
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
				model: this.model
			};
		},

		onRender: function() {

			// display package profile form view
			//
			this.showChildView('form', new NewPackageProfileFormView({
				model: this.model,
				packageVersion: this.options.packageVersion
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
			var data = this.getChildView('form').getChildView('form').$el[0];

			// get data to upload
			//
			var formData = new FormData(data);

			// append pertinent model data
			//
			formData.append('user_uid', application.session.user.get('user_uid'));
			
			// append external url data
			//
			if (this.getChildView('form').useExternalUrl()) {
				formData.append('external_url', this.model.get('external_url'));
				formData.append('checkout_argument', this.options.packageVersion.get('checkout_argument'));
			}

			// upload
			//
			this.options.packageVersion.upload(formData, options);
		},

		//
		// progress bar handling methods
		//

		showProgressBar: function() {
			var message;

			// fadeTo instead of fadeOut to prevent display: none;
			//
			this.$el.find('.progress').fadeTo(0, 0.0);
			this.$el.find('.progress').removeClass('invisible');
			this.$el.find('.progress').fadeTo(1000, 1.0);

			if (this.model.has('external_url')) {
				message = "Cloning repository";
			} else {
				message = "Uploading";
			}
			
			this.$el.find('.bar-message').text(message);
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
				this.getChildView('form').applyTo(this.model, this.options.packageVersion);

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
						self.options.packageVersion.set({
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
							message: "Package upload failed.  Please make sure that the file size of your package is smaller than the maximum upload size (" + application.config['max_upload_size'] + ")."
						});

						self.resetProgressBar();
					}
				});
			} else {

				// display warning message bar
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// return to packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});
		}
	});
});
