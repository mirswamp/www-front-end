/******************************************************************************\
|                                                                              |
|                        add-new-class-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for adding new user classes.                |
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
	'text!templates/users/accounts/classes/dialogs/add-new-class-dialog.tpl',
	'models/users/user-class',
	'views/dialogs/dialog-view'
], function($, _, Template, UserClass, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

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

					// close dialog
					//
					self.hide();

					// perform callback
					//
					if (self.options.onSave()) {
						self.onSave();
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save class membership."
					});
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection
			};
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
