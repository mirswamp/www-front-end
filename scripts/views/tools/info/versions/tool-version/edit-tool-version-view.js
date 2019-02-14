/******************************************************************************\
|                                                                              |
|                               edit-tool-version-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a tool's version info.              |
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
	'text!templates/tools/info/versions/tool-version/edit-tool-version.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/tools/info/versions/tool-version/tool-version-profile/tool-version-profile-form-view'
], function($, _, Backbone, Marionette, Template, Registry, ErrorView, ToolVersionProfileFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			toolVersionProfileForm: '#tool-version-profile-form'
		},

		events: {
			'input input, textarea': 'onChangeInput',
			'keyup input, textarea': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				tool: this.options.tool,
				'tool_name': this.options.tool.get('name')
			}));
		},

		onRender: function() {
			this.toolVersionProfileForm.show(
				new ToolVersionProfileFormView({
					model: this.model
				})
			);
		},

		//
		// event handling methods
		//

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);
		},

		onClickSave: function() {
			var self = this;

			// check validation
			//
			if (this.toolVersionProfileForm.currentView.isValid()) {

				// update model
				//
				this.toolVersionProfileForm.currentView.update(this.model);

				// disable save button
				//
				this.$el.find('#save').prop('disabled', true);

				// save changes
				//
				this.model.save(undefined, {

					// callbacks
					//
					success: function() {

						// return to tool version view
						//
						Backbone.history.navigate('#tools/versions/' + self.model.get('tool_version_uuid'), {
							trigger: true
						});
					},

					error: function() {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save tool version changes."
							})
						);
					}
				});
			}
		},

		onClickCancel: function() {

			// go to add tool version view
			//
			Backbone.history.navigate('#tools/versions/' + this.model.get('tool_version_uuid'), {
				trigger: true
			});
		}
	});
});
