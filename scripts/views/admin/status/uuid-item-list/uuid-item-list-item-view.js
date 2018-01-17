/******************************************************************************\
|                                                                              |
|                            uuid-item-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a generic list of named items      |
|        or uuids.                                                             |
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
	'text!templates/admin/status/uuid-item-list/uuid-item-list-item.tpl',
	'registry',
	'views/admin/status/item-list/item-list-item-view',
	'utilities/browser/html-utils'
], function($, _, Backbone, Marionette, Template, Registry, ItemListItemView) {
	return ItemListItemView.extend({

		// utility methods
		//
		getUrls: function(data) {
			var urls = [];
			for (key in data) {
				var item = data[key];
				if (!data[key]) {
					continue;
				}
				if (data[key].startsWith('{execrunuid}')) {

					// link to assessment run status view
					// 
					data[key] = data[key].replace('{execrunuid}', '');
					urls[key] = Registry.application.getURL() + '#runs/' + data[key] + '/status';
				} else if (data[key].startsWith('{packageuid}')) {

					// link to package view
					//
					data[key] = data[key].replace('{packageuid}', '');
					urls[key] = Registry.application.getURL() + '#packages/' + data[key];
				} else if (data[key].startsWith('{projectuid}')) {

					// link to project view
					//
					data[key] = data[key].replace('{projectuid}', '');
					urls[key] = Registry.application.getURL() + '#projects/' + data[key];
				}
			}
			return urls;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, {
				index: this.options.index + 1, 
				data: data,	
				urls: this.getUrls(data),	
				showNumbering: this.options.showNumbering
			});
		}
	});
});
