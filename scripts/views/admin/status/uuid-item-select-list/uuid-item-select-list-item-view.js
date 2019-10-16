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
	'text!templates/admin/status/uuid-item-select-list/uuid-item-select-list-item.tpl',
	'views/admin/status/uuid-item-list/uuid-item-list-item-view',
	'utilities/web/html-utils'
], function($, _, Template, UuidItemListItemView) {
	return UuidItemListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

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

		templateContext: function() {
			return {
				index: this.options.index + 1, 
				data: this.getData(this.model.attributes),	
				urls: this.getUrls(this.model.attributes),	
				fieldnames: this.options.fieldnames,
				showNumbering: this.options.showNumbering,
				selectable: this.isSelectable(),	
				selected: this.options.selected
			};
		}
	});
});
