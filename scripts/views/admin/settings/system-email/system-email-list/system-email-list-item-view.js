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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/admin/settings/system-email/system-email-list/system-email-list-item.tpl',
	'views/collections/tables/table-list-item-view',
], function($, _, Template, TableListItemView) {
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
				name: this.model.getFullName(),
				url: this.model.getAppUrl(),
				is_hibernating: this.model.isHibernating(),
				showHibernate: this.options.showHibernate
			};
		}
	});
});