/******************************************************************************\
|                                                                              |
|                              package-profile-view.js                         |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/details/package-profile/package-profile.tpl',
	'models/users/user',
	'views/base-view',
	'utilities/time/date-utils'
], function($, _, Template, User, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #edit-package': 'onClickEditPackage',
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				isOwned: this.model.isOwned()
			};
		},

		onRender: function() {
			this.showOwner(new User(this.model.get('package_owner')));
		},

		showOwner: function(owner) {
			this.$el.find('#owner').html(
				$('<a>',{
					text: owner.getFullName(),
					title: 'contact package owner',
					href: 'mailto:' + owner.get('email')
				})
			);
		},

		//
		// event handling methods
		//

		onClickEditPackage: function() {

			// go to edit package view
			//
			Backbone.history.navigate('#packages/' + this.model.get('package_uuid') + '/edit', {
				trigger: true
			});
		}
	});
});
