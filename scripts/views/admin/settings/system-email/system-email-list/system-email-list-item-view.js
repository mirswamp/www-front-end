/******************************************************************************\
|                                                                              |
|                        system-email-list-item-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing system email users.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/admin/settings/system-email/system-email-list/system-email-list-item.tpl',
	'views/collections/tables/table-list-item-view',
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .select input': 'onClickSelectInput'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.model.selected,
				name: this.model.getFullName(),
				url: this.model.getAppUrl(),
				is_hibernating: this.model.isHibernating(),
				showHibernate: this.options.showHibernate
			};
		},

		//
		// event handling methods
		//

		onClickSelectInput: function(event) {
			var checked = $(event.target).prop('checked');
			var parent = this.options.parent.options.parent;

			// check for shift clicking
			//
			if (event.shiftKey && parent.previousIndex != undefined) {

				// select / deselect range
				//
				parent.setSelectedRange(parent.previousIndex, this.options.index, checked);
			}

			// save index for shift clicking
			//
			parent.previousIndex = this.options.index;

			// perform callback
			//
			if (!event.shiftKey && this.options.onClick) {
				this.options.onClick(this.options.index);
			}
		}
	});
});