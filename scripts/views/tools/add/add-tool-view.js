/******************************************************************************\
|                                                                              |
|                                  add-tool-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view used to add / upload new tools.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/add/add-tool.tpl',
	'models/tools/tool',
	'models/tools/tool-version',
	'views/base-view',
	'views/tools/info/details/tool-profile/new-tool-profile-form-view'
], function($, _, Template, Tool, ToolVersion, BaseView, NewToolProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#new-tool-profile-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			this.model = new Tool({
				'tool_owner_uuid': this.options.user.get('user_uid'),
				'tool_sharing_status': 'private'
			});
			this.toolVersion = new ToolVersion({});
		},

		//
		// methods
		//

		save: function() {
			var self = this;

			// save tool
			//
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {

					// save tool version
					//
					self.saveVersion(self.model);
				}, 

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save tool."
					});
				}
			});
		},

		saveVersion: function(tool) {
			var self = this;

			// set tool version attributes
			//
			this.toolVersion.set({
				'tool_uuid': tool.get('tool_uuid')
			});

			this.toolVersion.save(undefined, {

				success: function() {
					self.toolVersion.add({
						data: {
							'tool_path': self.toolVersion.get('tool_path')
						},

						// callbacks
						//
						success: function() {

							// go to tool view
							//
							application.navigate('#tools/' + tool.get('tool_uuid'));
						},

						error: function(response) {

							// show error message
							//
							application.error({
								message: response.responseText
							});
						}
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save tool version."
					});
				}
			});
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

			// display tool profile form
			//
			this.showChildView('form', new NewToolProfileFormView({
				model: this.model,
				toolVersion: this.toolVersion
			}));
		},

		showWarning: function() {
			this.$el.find('.alert').show();
		},

		hideWarning: function() {
			this.$el.find('.alert').hide();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickSubmit: function() {
			var self = this;

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update models
				//
				this.getChildView('form').applyTo(this.model, this.toolVersion);

				// get data to upload from form
				//
				var data = new FormData(this.$el.find('#new-tool-version-profile-form form')[0]);

				// append pertitnent model data
				//
				data.append('tool_owner_uuid', this.model.get('tool_owner_uuid'));
				data.append('user_uid', this.options.user.get('user_uid'));

				// upload
				//
				self.toolVersion.upload(data, {

					// callbacks
					//
					success: function(data) {

						// save path to version
						//
						self.toolVersion.set({
							'tool_path': data.destination_path + '/' + data.filename
						});

						// save tool / version
						//
						self.save();
					},

					error: function(response) {

						// show error message
						//
						application.error({
							message: "Tool " + response.statusText
						});
					}
				});
			} else {
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to home view
			//
			application.navigate('#home');
		}
	});
});
