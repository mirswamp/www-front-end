/******************************************************************************\
|                                                                              |
|                             edit-tool-details-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a tool's profile info.              |
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
	'text!templates/tools/info/details/edit-tool-details.tpl',
	'views/base-view',
	'views/tools/info/details/tool-profile/tool-profile-form-view'
], function($, _, Template, BaseView, ToolProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#tool-profile-form'
		},

		events: {
			'input input': 'onChangeInput',
			'keyup input': 'onChangeInput',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		onRender: function() {

			// display tool profile form view
			//
			this.showChildView('form', new ToolProfileFormView({
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

						// return to tool view
						//
						Backbone.history.navigate('#tools/' + self.model.get('tool_uuid'), {
							trigger: true
						});
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not save tool changes."
						});
					}
				});
			}
		},

		onClickCancel: function() {

			// go to tool view
			//
			Backbone.history.navigate('#tools/' + this.model.get('tool_uuid'), {
				trigger: true
			});
		}
	});
});