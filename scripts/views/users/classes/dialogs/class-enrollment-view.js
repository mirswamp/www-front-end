/******************************************************************************\
|                                                                              |
|                           class-enrollment-view.js                           |
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
	'text!templates/users/classes/dialogs/class-enrollment.tpl',
	'models/users/user-class'
], function($, _, Backbone, Marionette, Registry, Template, UserClass) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

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

		template: function(data) {
			return _.template(Template, {
				collection: this.collection
			});
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
