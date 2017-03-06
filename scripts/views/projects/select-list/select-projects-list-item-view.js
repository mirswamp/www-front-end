/******************************************************************************\
|                                                                              |
|                            select-projects-item-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single selectable project           |
|        list item.                                                            |
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
	'text!templates/projects/select-list/select-projects-list-item.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		//
		// methods
		//

		isSelected: function() {
			return this.$el.find('input').is(':checked');
		},

		setSelected: function(selected) {
			if (selected) {
				this.$el.find('input').attr('checked', 'checked');
			} else {
				this.$el.find('input').removeAttr('checked');
			}
		}
	});
});