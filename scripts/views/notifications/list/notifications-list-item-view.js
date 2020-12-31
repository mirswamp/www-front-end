/******************************************************************************\
|                                                                              |
|                          notifications-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single notification list         |
|        item.                                                                 |
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
	'text!templates/notifications/list/notifications-list-item.tpl',
	'utilities/time/date-format',
	'models/projects/project-invitation',
	'models/admin/admin-invitation',
	'models/permissions/user-permission',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, DateFormat, ProjectInvitation, AdminInvitation, UserPermission, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		className: 'active',
		template: _.template(Template),

		events: {
			'click': 'onClick'
		},

		//
		// querying methods
		//

		getNotificationType: function() {
			if (this.model.constructor == ProjectInvitation) {
				return 'project invitation';
			} else if (this.model.constructor == AdminInvitation) {
				return 'admin invitation';
			} else if (this.model.constructor == UserPermission) {
				return 'user permission';
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				type: this.getNotificationType(),
				description: this.model.getDescription()
			};
		},

		//
		// event handling methods
		//

		onClick: function() {

			// go to notification url
			//
			application.navigate(this.model.getNotificationHash());

			// perform callback
			//
			if (this.options.onClick) {
				this.options.onClick();
			}
		}
	});
});
