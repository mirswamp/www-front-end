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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'tooltip',
	'popover',
	'text!templates/packages/info/versions/info/details/new-package-version-details.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/details/package-version-profile/new-package-version-profile-form-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, Registry, ErrorView, NewPackageVersionProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			newPackageVersionProfileForm: '#new-package-version-profile-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #next': 'onClickNext',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				package: this.options.package
			}));
		},

		onRender: function() {

			// display package version profile form view
			//
			this.newPackageVersionProfileForm.show(
				new NewPackageVersionProfileFormView({
					model: this.model,
					package: this.options.package
				})
			);

			// add popover
			//
			this.$el.find('#formats-supported').popover({
				'trigger': 'click',
				'placement': 'bottom'
			})
		},

		showWarning: function() {
			this.$el.find('.alert').show();
		},

		hideWarning: function() {
			this.$el.find('.alert').hide();
		},

		//
		// uploading methods
		//

		upload: function(options) {

			// get data to upload
			//
			var data = new FormData(this.newPackageVersionProfileForm.currentView.$el.find('form')[0]);

			// append pertinent model data
			//
			data.append('package_uuid', this.options.package.get('package_uuid'));
			data.append('user_uid', Registry.application.session.user.get('user_uid'));

			// upload
			//
			this.model.upload(data, options);
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
			if (this.newPackageVersionProfileForm.currentView.isValid()) {

				// update model
				//
				this.newPackageVersionProfileForm.currentView.update(this.model);

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

						// show error dialog view
						//
						Registry.application.modal.show(new ErrorView({
							message: "Package upload error: " + response.statusText
						}));

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
			Backbone.history.navigate('#packages/' + this.options.package.get('package_uuid'), {
				trigger: true
			});
		},

		//
		// progress bar events
		//

		showProgressBar: function() {

			// fadeTo instead of fadeOut to prevent display: none;
			//
			this.$el.find('.progress').fadeTo(0, 0.0);
			this.$el.find('.progress').removeClass('invisible');
			this.$el.find('.progress').fadeTo(1000, 1.0);
		},

		resetProgressBar: function() {
			this.$el.find('.bar').width('0%');
			this.$el.find('.bar-text').text('');
			this.$el.find('.progress').fadeTo(1000, 0.0);
		},

		showProgressPercent: function(percentage) {
			this.$el.find('.bar').width(percentage * 100 + '%');
			this.$el.find('.bar-text').text("Uploading " + Math.ceil(percentage * 100) + "%");
		}
	});
});
