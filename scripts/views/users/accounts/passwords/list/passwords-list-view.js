/******************************************************************************\
|                                                                              |
|                            passwords-list-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a list of application passwords.      |                                               |
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
	'text!templates/users/accounts/passwords/list/passwords-list.tpl',
	'collections/authentication/app-passwords',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/accounts/passwords/list/passwords-list-item-view'
], function($, _, Template, AppPasswords, BaseView, SortableTableListView, PasswordsListItemView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: PasswordsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No passwords.")
		}),

		// sort by date column in descending order 
		//
		sortBy: ['date', 'descending'],

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				count: this.collection.length,
				showDelete: this.options.showDelete
			};
		},

		childViewOptions: function() {			
			return {
				readOnly: this.options.readOnly,
				showDelete: this.options.showDelete,
				parent: this
			};
		}
	});
});
