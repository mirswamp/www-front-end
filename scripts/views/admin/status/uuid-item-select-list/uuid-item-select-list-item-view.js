/******************************************************************************\
|                                                                              |
|                         uuid-item-select-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a generic list of named items      |
|        or uuids with checkboxes.                                             |
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
	'text!templates/admin/status/uuid-item-select-list/uuid-item-select-list-item.tpl',
	'registry',
	'views/admin/status/uuid-item-list/uuid-item-list-item-view',
	'utilities/browser/html-utils'
], function($, _, Backbone, Marionette, Template, Registry, UuidItemListItemView) {
	return UuidItemListItemView.extend({

		//
		// selection methods
		//

		isSelectable: function() {
			return this.model.get('ST') != 'Removed';	
		},

		isSelected: function() {
			return this.$el.find('input[name="select"]').is(':checked');
		},

		setSelected: function(selected) {
			if (selected) {
				this.$el.find('input[name="select"]').attr('checked', 'checked');
			} else {
				this.$el.find('input[name="select"]').removeAttr('checked');
			}
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
				showNumbering: this.options.showNumbering,
				selectable: this.isSelectable(),	
				selected: this.options.selected
			});
		}
	});
});
