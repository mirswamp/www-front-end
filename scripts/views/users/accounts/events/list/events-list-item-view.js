/******************************************************************************\
|                                                                              |
|                            events-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows an instance of a single event.         |
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
	'text!templates/users/accounts/events/list/events-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		// 
		// methods
		//

		getDate: function() {
			return this.model.get('date');
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				date: this.getDate()
			};
		}
	});
});