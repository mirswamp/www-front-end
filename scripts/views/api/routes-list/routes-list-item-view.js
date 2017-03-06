/******************************************************************************\
|                                                                              |
|                              routes-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single api method / route.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/api/routes-list/routes-list-item.tpl'
], function($, _, Backbone, Marionette, Registry, Template) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				index: this.options.index + 1,
				//url: this.model.has('route_uuid')? Registry.application.getURL() + '#api/routes/' + this.model.get('route_uuid') : null,
				url: Registry.application.getURL() + '#api/routes/' + this.model.get('method').toLowerCase() + '/' + this.model.get('route'),
				editable: this.options.editable,
				showServer: this.options.showServer,
				showCategory: this.options.showCategory,
				showUnfinished: this.options.showUnfinished,
				showPrivate: this.options.showPrivate,
				showNumbering: this.options.showNumbering
			}));
		}
	});
});