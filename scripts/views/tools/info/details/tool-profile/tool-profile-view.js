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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/info/details/tool-profile/tool-profile.tpl',
	'models/users/user',
	'views/base-view',
	'utilities/time/date-utils'
], function($, _, Template, User, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
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
