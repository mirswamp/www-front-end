/******************************************************************************\
|                                                                              |
|                              add-new-class-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box for adding new user classes.          |
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
	'registry',
	'text!templates/users/classes/dialogs/add-new-class.tpl',
	'models/users/user-class'
], function($, _, Backbone, Marionette, Registry, Template, UserClass) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'change select': 'onChangeSelect',
			'click #ok': 'onClickOk'
		},

		//
		// querying methods
		//

		getSelected: function() {
			return this.$el.find('select').val();
		},

		getSelectedIndex: function() {
			return this.$el.find('select option:selected').attr('index');
		},

		//
		// methods
		//

		save: function() {
			var self = this;
			var index = this.getSelectedIndex();
			var model = this.collection.at(index);

			// save new class membership
			//
			model.addMember(this.model, {

				// callbacks
				//
				success: function() {

					// close modal dialog
					//
					Registry.application.modal.hide();

					// perform callback
					//
					if (self.options.onSave()) {
						self.onSave();
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save class membership."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, {
				collection: this.collection
			});
		},

		//
		// event handling methods
		//

		onChangeSelect: function() {
			this.$el.find('#ok').prop('disabled', false);
			this.$el.find('select option[value="blank"]').remove();

			// show alert info
			//
			this.$el.find('.alert-info').show();
		},

		onClickOk: function() {
			this.save();
		}
	});
});
