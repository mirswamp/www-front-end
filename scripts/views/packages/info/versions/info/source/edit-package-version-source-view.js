/******************************************************************************\
|                                                                              |
|                        edit-package-version-source-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a package versions's source         |
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
	'text!templates/packages/info/versions/info/source/edit-package-version-source.tpl',
	'views/base-view',
	'views/packages/info/versions/info/source/source-profile/package-version-source-profile-form-view',
	'views/packages/info/versions/info/source/dialogs/package-version-file-types-dialog-view'
], function($, _, Template, BaseView, PackageVersionSourceProfileFormView, PackageVersionFileTypesDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-version-source-profile-form'
		},

		events: {
			'input input': 'onChangeInput',
			'keyup input': 'onChangeInput',
			'click .alert .close': 'onClickAlertClose',
			'click #save': 'onClickSave',
			'click #show-file-types': 'onClickShowFileTypes',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		save: function() {
			var self = this;

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);
		
			// save changes
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {

					// return to package version source view
					//
					Backbone.history.navigate('#packages/versions/' + self.model.get('package_version_uuid') + '/source', {
						trigger: true
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save package version changes."
					});
				}
			});
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
			var self = this;

			// show profile
			//
			this.showChildView('form', new PackageVersionSourceProfileFormView({
				model: this.model,
				package: this.options.package,
				parent: this,

				// callbacks
				//
				onChange: function() {

					// enable save button
					//
					self.$el.find('#save').prop('disabled', false);
				}
			}));
		},

		showWarning: function(message) {
			this.$el.find('.alert-warning .message').html(message);
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickPrev: function() {

			// show next prev view
			//
			this.options.parent.showDetails();
		},
		
		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

				// check build system
				//
				this.model.checkBuildSystem({

					// callbacks
					//
					success: function() {
		
						// save package version
						//
						self.save();
					},

					error: function(data) {
						application.confirm({
							title: 'Build System Warning',
							message: data.responseText + "  Would you like to continue anyway?",

							// callbacks
							//
							accept: function() {

								// save package version
								//
								self.save();
							}
						});
					}
				});
			} else {

				// show warning message bar
				//
				this.showWarning("This form contains errors.  Please correct and resubmit.");
			}
		},

		onClickShowFileTypes: function() {

			// show package version file types dialog
			//
			application.show(new PackageVersionFileTypesDialogView({
				model: this.model,
				packagePath: this.getChildView('form').getPackagePath()
			}));
		},

		onClickCancel: function() {

			// go to package view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/source', {
				trigger: true
			});
		}
	});
});