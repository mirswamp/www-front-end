/******************************************************************************\
|                                                                              |
|                              user-classes-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a user's application passwords.       |
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
	'collections/users/user-classes',
	'text!templates/users/classes/user-classes.tpl',
	'registry',
	'views/users/classes/list/classes-list-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, UserClasses, Template, Registry, ClassesListView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			classesList: '#classes-list'
		},

		events: {
			'click #add-new-class': 'onClickAddNewClass'
		},

		//
		// methods
		//

		initialize: function() {

			// set attributes
			//
			this.collection = new UserClasses();
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show list subview
			//
			this.fetchAndShowList();
		},

		showList: function() {
			this.classesList.show(
				new ClassesListView({
					model: this.model,
					collection: this.collection,
					showDelete: true
				})
			);
		},

		fetchAndShowList: function() {
			var self = this;

			// fetch collection of passwords
			//
			this.collection.fetchByUser(this.model, {

				// callbacks
				//
				success: function(data) {
					self.showList();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get classes for this user."
						})
					);
				}
			});
		},

		showAddNewClassDialog: function(collection) {
			var self = this;
			require([
				'views/users/classes/dialogs/add-new-class-view'
			], function (AddNewClassView) {
				Registry.application.modal.show(
					new AddNewClassView({
						model: self.model,
						collection: collection,

						// callbacks
						//
						onSave: function() {
							self.fetchAndShowList();
						}
					})
				);
			});		
		},

		//
		// event handling methods
		//

		onClickAddNewClass: function() {
			var self = this;
			new UserClasses().fetch({

				// callbackss
				//
				success: function(collection) {

					// remove classes that user is already enrolled in
					//
					var i = 0; 
					while (i < collection.length) {
						var model = collection.at(i);
						if (self.collection.contains(model)) {
							collection.remove(model);
						} else {
							i++;
						}
					}

					if (collection.length == 0) {

						// show notify dialog
						//
						Registry.application.notify({
							message: "There are no more classes to enroll in."
						});
					} else {

						// show add new class dialog
						//
						self.showAddNewClassDialog(collection);	
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get list of classes."
						})
					);		
				}
			})
		}
	});
});