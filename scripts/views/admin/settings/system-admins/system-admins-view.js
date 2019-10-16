/******************************************************************************\
|                                                                              |
|                               system-admins-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the system administrators.            |
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
	'text!templates/admin/settings/system-admins/system-admins.tpl',
	'models/users/user',
	'collections/users/users',
	'views/base-view',
	'views/admin/settings/system-admins/system-admins-list/system-admins-list-view'
], function($, _, Template, User, Users, BaseView, SystemAdminsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			'list': '#system-admins-list'
		},

		events: {
			'click #invite-admins': 'onClickInviteAdmins'
		},

		//
		// constructor
		//

		initialize: function() {
			this.collection = new Users();
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// get collection of system admins
			//
			this.collection.fetchAdmins(application.session.user, {

				// callbacks
				//
				success: function() {

					// show system admins list view
					//
					self.showChildView('list', new SystemAdminsListView({
						collection: self.collection,
						showDelete: true
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch system admins."
					});
				}
			});
		},

		//
		// event handling methods
		//

		onClickInviteAdmins: function() {

			// go to invite admins view
			//
			Backbone.history.navigate('#settings/admins/invite', {
				trigger: true
			});
		}
	});
});
