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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/info/versions/tool-version/edit-tool-version.tpl',
	'views/base-view',
	'views/tools/info/versions/tool-version/tool-version-profile/tool-version-profile-form-view'
], function($, _, Template, BaseView, ToolVersionProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		regions: {
			form: '#tool-version-profile-form'
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

		templateContext: function() {
			return {
				model: this.model,
				tool: this.options.tool,
				'tool_name': this.options.tool.get('name')
			};
		},

		onRender: function() {
			this.showChildView('form', new ToolVersionProfileFormView({
				model: this.model
			}));
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
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

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
						application.navigate('#tools/versions/' + self.model.get('tool_version_uuid'));
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not save tool version changes."
						});
					}
				});
			}
		},

		onClickCancel: function() {

			// go to add tool version view
			//
			application.navigate('#tools/versions/' + this.model.get('tool_version_uuid'));
		}
	});
});
