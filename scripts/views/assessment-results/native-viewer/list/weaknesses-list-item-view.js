/******************************************************************************\
|                                                                              |
|                            weaknesses-list-item-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single weakness.                 |
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
	'bootstrap/popover',
	'text!templates/assessment-results/native-viewer/list/weaknesses-list-item.tpl',
	'utilities/browser/html-utils'
], function($, _, Backbone, Marionette, Popover, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'mousedown': 'onMouseDown',
			'mousedown a': 'onMouseDownLink',
			'mousedown .popover':  'onMouseDownPopover'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				index: this.options.index + 1,
				showNumbering: this.options.showNumbering,
			}));
		},

		//
		// event handling methods
		//

		onMouseDown: function() {
			this.options.parent.$el.find('.popover').remove();
		},

		onMouseDownLink: function(event) {
			this.options.parent.$el.find('.popover').remove();
			$(event.target).closest('a').popover('show');
			event.stopPropagation();
		},

		onMouseDownPopover: function(event) {
			event.stopPropagation();
		}
	});
});
