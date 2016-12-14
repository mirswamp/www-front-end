/******************************************************************************\
|                                                                              |
|                              platforms-list-item-view.js                     |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/platforms/list/platforms-list-item.tpl',
	'registry',
	'utilities/time/date-format'
], function($, _, Backbone, Marionette, Template, Registry, DateFormat) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				user: Registry.application.session.user,
				model: this.model,
				index: this.options.index + 1,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering,
				showDeactivatedPackages: this.options.showDeactivatedPackages
			}));
		}
	});
});
