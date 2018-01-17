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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/notifications/list/notifications-list-item.tpl',
	'registry',
	'utilities/time/date-format',
	'models/projects/project-invitation',
	'models/admin/admin-invitation',
	'models/permissions/user-permission',
	'utilities/time/date-utils'
], function($, _, Backbone, Marionette, Template, Registry, DateFormat, ProjectInvitation, AdminInvitation, UserPermission) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',
		className: 'active',

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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				type: this.getNotificationType(),
				index: this.options.index + 1,
				showNumbering: this.options.showNumbering
			}));
		},

		//
		// event handling methods
		//

		onClick: function() {

			// dismiss dialog 
			//
			Registry.application.modal.hide();

			// go to notification url
			//
			Backbone.history.navigate(this.model.getNotificationHash(), {
				trigger: true
			});
		}
	});
});
