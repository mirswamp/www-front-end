/******************************************************************************\
|                                                                              |
|                        tool-permission-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box used to ask for tool permission.            |
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
	'text!templates/tools/permissions/dialogs/tool-permission-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/tools/permissions/forms/tool-permission-form-view'
], function($, _, Template, DialogView, ToolPermissionFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#tool-permission-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.model.get('title')
			};
		},

		onRender: function() {

			// show subviews
			//
			this.showPermissionsForm();
		},

		showPermissionsForm: function() {
			var self = this;
			this.showChildView('form', new ToolPermissionFormView({
				model: this.model,

				// callbacks
				//
				onChange: function() {
					if (self.getChildView('form').isValid()) {

						// enable button
						//
						self.$el.find('#ok').prop('disabled', false);
					} else {

						// disable button
						//
						self.$el.find('#ok').prop('disabled', true);
					}
				}
			}));
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickOk: function() {
			if (this.getChildView('form').isValid()) {
				this.hide();

				// perform callback
				//
				if (this.options.accept) {
					this.options.accept(this.getChildView('form').getData());
				}
			} else {
				this.showWarning();
			}
		}
	});
});

