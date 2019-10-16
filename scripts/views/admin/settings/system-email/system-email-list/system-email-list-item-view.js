/******************************************************************************\
|                                                                              |
|                        system-email-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing system email users.                   |
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
	'text!templates/admin/settings/system-email/system-email-list/system-email-list-item.tpl',
	'models/users/user',
	'views/collections/tables/table-list-item-view',
], function($, _, Template, User, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				User: User,
				model: this.model,
				url: application.getURL() + '#accounts',
				index: this.options.index,
				showNumbering: this.options.showNumbering,
				showHibernate: this.options.showHibernate
			};
		}
	});
});
