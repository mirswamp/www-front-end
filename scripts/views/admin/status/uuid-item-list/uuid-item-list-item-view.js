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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'moment',
	'text!templates/admin/status/uuid-item-list/uuid-item-list-item.tpl',
	'registry',
	'views/admin/status/item-list/item-list-item-view',
	'utilities/browser/html-utils',
	'utilities/time/date-utils',
	'library/moment/moment-timezone-with-data'
], function($, _, Backbone, Marionette, Moment, Template, Registry, ItemListItemView) {
	return ItemListItemView.extend({

		// utility methods
		//
		getUrls: function(data) {
			var urls = [];
			for (key in data) {
				var item = data[key];
				if (!item) {
					continue;
				}

				// parse strings to compose urls
				// 
				if (typeof item == 'string') {
					if (item.startsWith('{execrunuid}')) {

						// link to assessment run status view
						// 
						data[key] = item.replace('{execrunuid}', '');
						urls[key] = Registry.application.getURL() + '#runs/' + data[key] + '/status';
					} else if (item.startsWith('{packageuid}')) {

						// link to package view
						//
						data[key] = item.replace('{packageuid}', '');
						urls[key] = Registry.application.getURL() + '#packages/' + data[key];
					} else if (item.startsWith('{projectuid}')) {

						// link to project view
						//
						data[key] = item.replace('{projectuid}', '');
						urls[key] = Registry.application.getURL() + '#projects/' + data[key];
					}
				}
			}
			return urls;
		},

		getData: function(data) {
			for (key in data) {
				var item = data[key];
				if (!item) {
					continue;
				}

				// parse strings 
				// 
				if (typeof item == 'string') {
					if (item.startsWith('{timestamp}')) {

						// convert and format timestamp
						//
						item = item.replace('{timestamp}', '');
						if (item != '') {
							var localDate =  UTCDateToLocalDate(item).format('mm/dd/yyyy \n HH:MM');
							var timezone = Moment.tz(Moment.tz.guess()).format('z');
							data[key] =	localDate + ' ' + timezone;
						} else {
							data[key] = item;
						}
					}
				}
			}
			return data;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, {
				index: this.options.index + 1, 
				data: this.getData(data),
				urls: this.getUrls(data),	
				fieldnames: this.options.fieldnames,
				showNumbering: this.options.showNumbering
			});
		}
	});
});
