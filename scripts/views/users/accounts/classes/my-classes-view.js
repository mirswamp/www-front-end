/******************************************************************************\
|                                                                              |
|                              my-classes-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the current user's classes.           |
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
	'collections/users/user-classes',
	'text!templates/users/accounts/classes/my-classes.tpl',
	'views/base-view',
	'views/users/accounts/classes/list/classes-list-view',
], function($, _, UserClasses, Template, BaseView, ClassesListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#classes-list'
		},

		events: {
			'click #add-new-class': 'onClickAddNewClass'
		},

		//
		// constructor
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

			// preserve existing sorting column and order
			//
			if (this.getChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			this.showChildView('list', new ClassesListView({
				model: this.model,

				// options
				//
				sortBy: this.options.sortBy,
				collection: this.collection,
				showDelete: true
			}));
		},

		fetchAndShowList: function() {
			var self = this;

			// fetch collection of passwords
			//
			this.collection.fetchByUser(application.session.user, {

				// callbacks
				//
				success: function(data) {
					self.showList();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get classes for this user."
					});
				}
			});
		},

		showAddNewClassDialog: function(collection) {
			var self = this;
			require([
				'views/users/accounts/classes/dialogs/add-new-class-dialog-view'
			], function (AddNewClassDialogView) {
				application.show(new AddNewClassDialogView({
					model: self.model,
					collection: collection,

					// callbacks
					//
					onSave: function() {
						self.fetchAndShowList();
					}
				}));
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

						// show notification
						//
						application.notify({
							message: "There are no more classes to enroll in."
						});
					} else {

						// show add new class dialog
						//
						self.showAddNewClassDialog(collection);	
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get list of classes."
					});
				}
			});
		}
	});
});
