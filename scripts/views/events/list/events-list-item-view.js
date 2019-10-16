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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/events/list/events-list-item.tpl',
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
				index: this.options.index,
				showNumbering: this.options.showNumbering,
				date: this.getDate()
			};
		}
	});
});