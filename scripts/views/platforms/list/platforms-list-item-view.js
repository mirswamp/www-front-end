/******************************************************************************\
|                                                                              |
|                           platforms-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of platforms.                                                  |
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
	'text!templates/platforms/list/platforms-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-format'
], function($, _, Template, TableListItemView, DateFormat) {
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
				url: application.session.user? this.model.getAppUrl() : null
			};
		}
	});
});
