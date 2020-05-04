/******************************************************************************\
|                                                                              |
|                      class-enrollment-dialog-view.js                         |
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
	'text!templates/users/accounts/classes/dialogs/class-enrollment-dialog.tpl',
	'models/users/user-class',
	'views/dialogs/dialog-view'
], function($, _, Template, UserClass, DialogView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'change #class-code': 'onChangeClassCode',
			'click #ok': 'onClickOk'
		},

		//
		// querying methods
		//

		getSelectedIndex: function() {
			return this.$el.find('select option:selected').attr('index');
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

		onChangeClassCode: function() {

			// hide / show alert info
			//
			var classCode = this.$el.find('#class-code').val();
			if (classCode != 'none') {
				this.$el.find('.alert-info').show();
			} else {
				this.$el.find('.alert-info').hide();
			}
		},

		onClickOk: function() {
			var index = this.getSelectedIndex();
			if (index) {
				var model = this.collection.at(index);
				this.options.accept(model);
			} else {
				this.options.accept();	
			}
		}
	});
});
