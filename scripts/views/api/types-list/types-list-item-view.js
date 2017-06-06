/******************************************************************************\
|                                                                              |
|                              types-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a single api data type.                |
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
	'text!templates/api/types-list/types-list-item.tpl'
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
				url: Registry.application.getURL() + '#api/types/' + this.model.get('name'),
				editable: this.options.editable,
				private: this.options.private,
				showServer: this.options.showServer,
				showCategory: this.options.showCategory,
				showUnfinished: this.options.showUnfinished,
				showPrivate: this.options.showPrivate,
				showNumbering: this.options.showNumbering
			}));
		}
	});
});