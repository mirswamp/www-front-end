/******************************************************************************\
|                                                                              |
|                        invalid-project-invitation-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that reports an invalid project invitation.       |
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
	'text!templates/projects/info/members/invitations/invalid-project-invitation.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				message: this.options.message
			}));
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
			window.location.reload();
		}
	});
});
