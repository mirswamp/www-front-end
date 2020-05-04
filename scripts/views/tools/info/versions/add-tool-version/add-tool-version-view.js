/******************************************************************************\
|                                                                              |
|                                add-tool-version-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view used to add / upload new tool versions.         |
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
	'text!templates/tools/info/versions/add-tool-version/add-tool-version.tpl',
	'models/tools/tool',
	'models/tools/tool-version',
	'views/base-view',
	'views/tools/info/versions/tool-version/tool-version-profile/new-tool-version-profile-form-view'
], function($, _, Template, Tool, ToolVersion, BaseView, NewToolVersionProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			profile: '#new-tool-version-profile'
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
			this.model = new ToolVersion({
				tool_uuid: this.options.tool.get('tool_uuid')
			});
		},

		//
		// methods
		//

		save: function() {
			var self = this;
			this.model.save(undefined, {

				// callbacks
				//
				success: function() {
					self.model.add({
						data: {
							'tool_path': self.model.get('tool_path')
						},

						// callbacks
						//
						success: function() {

							// go to tool view
							//
							application.navigate('#tools/' + self.options.tool.get('tool_uuid'));
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
				tool: this.options.tool,
				model: this.model
			};
		},

		onRender: function() {

			// display tool profile form
			//
			this.showChildView('form', new NewToolVersionProfileFormView({
				model: this.model
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
			if (this.getChildView('profile').isValid()) {

				// update model
				//
				this.getChildView('profile').applyTo(this.model);

				// get data to upload
				//
				var data = new FormData(this.$el.find('#new-tool-version-profile form')[0]);

				// append pertitnent model data
				//
				data.append('tool_owner_uuid', this.options.tool.get('tool_owner_uuid'));
				data.append('user_uid', application.session.user.get('user_uid'));

				// upload
				//
				this.model.upload(data, {

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
							'tool_path': data.destination_path + '/' + data.filename
						});

						// save tool version
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

			// return to tool view
			//
			application.navigate('#tools/' + this.options.tool.get('tool_uuid'));
		}
	});
});
