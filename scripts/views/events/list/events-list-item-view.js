/******************************************************************************\
|                                                                              |
|                              events-list-item-view.js                        |
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
	'backbone',
	'marionette',
	'text!templates/events/list/events-list-item.tpl',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		tagName: 'tr',
		
		// 
		// methods
		//

		getInfo: function(data) {
			return '';
		},

		getDate: function() {
			return this.model.get('date');
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				showNumbering: this.options.showNumbering,
				info: this.getInfo(data),
				date: this.getDate()
			}));
		}
	});
});