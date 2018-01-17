/******************************************************************************\
|                                                                              |
|                             tool-permission-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box that is used to                       |
|        prompt the user for a comment to proceed with some action.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/tools/permissions/dialogs/tool-permission.tpl',
	'views/tools/permissions/forms/tool-permission-form-view'
], function($, _, Backbone, Marionette, Registry, Template, ToolPermissionFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			toolPermissionForm: '#tool-permission-form'
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {

			// show subviews
			//
			this.showPermissionsForm();
		},

		showPermissionsForm: function() {
			var self = this;
			this.toolPermissionForm.show(
				new ToolPermissionFormView({
					model: this.model,

					// callbacks
					//
					onChange: function() {
						if (self.toolPermissionForm.currentView.isValid()) {

							// enable button
							//
							self.$el.find('#ok').prop('disabled', false);
						} else {

							// disable button
							//
							self.$el.find('#ok').prop('disabled', true);
						}

					}
				})
			);
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
			this.toolPermissionForm.currentView.validate();
			if (this.toolPermissionForm.currentView.isValid()) {
				this.hideWarning();

				// perform callback
				//
				if (this.options.accept) {
					this.options.accept(this.toolPermissionForm.currentView.getData());
				}
			} else {
				this.showWarning();
			}
		}
	});
});

