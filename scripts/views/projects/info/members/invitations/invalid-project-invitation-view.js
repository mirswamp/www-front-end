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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/members/invitations/invalid-project-invitation.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				message: this.options.message
			};
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// go to home view
			//
			application.navigate('#home');
			window.location.reload();
		}
	});
});
