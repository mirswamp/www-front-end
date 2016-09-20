/******************************************************************************\
|                                                                              |
|                                tool-profile-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a project's profile information.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/tools/info/details/tool-profile/tool-profile.tpl',
	'registry',
	'models/users/user',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, User, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			var user = Registry.application.session.user;
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {
			this.showOwner(new User(this.model.get('tool_owner')));
		},

		showOwner: function(owner) {
			this.$el.find('#owner').html(
				$('<a>',{
					text: owner.getFullName(),
					title: 'contact tool owner',
					href: 'mailto:' + owner.get('email')
				})
			);
		}
	});
});
