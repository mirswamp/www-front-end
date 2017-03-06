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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/settings/system-admins/system-admins.tpl',
	'registry',
	'collections/users/users',
	'views/dialogs/error-view',
	'views/admin/settings/system-admins/system-admins-list/system-admins-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Users, ErrorView, SystemAdminsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			systemAdminsList: '#system-admins-list'
		},

		events: {
			'click #invite-admins': 'onClickInviteAdmins'
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new Users();
		},

		onRender: function() {
			var self = this;

			// get collection of system admins
			//
			this.collection.fetchAdmins(Registry.application.session.user, {

				// callbacks
				//
				success: function() {

					// show system admins list view
					//
					self.systemAdminsList.show(
						new SystemAdminsListView({
							collection: self.collection,
							showDelete: true
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch system admins."
						})
					);
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
