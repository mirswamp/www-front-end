/******************************************************************************\
|                                                                              |
|                               item-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a generic list of named items.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/status/item-list/item-list-item.tpl',
	'registry',
	'utilities/browser/html-utils'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, {
				index: this.options.index + 1, 
				data: data,	
				showNumbering: this.options.showNumbering
			});
		}
	});
});
