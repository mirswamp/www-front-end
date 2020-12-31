/******************************************************************************\
|                                                                              |
|                      select-projects-list-item-view.js                       |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/select-list/select-projects-list-item.tpl',
	'views/projects/list/projects-list-item-view'
], function($, _, Template, ProjectsListItemView) {
	return ProjectsListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

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