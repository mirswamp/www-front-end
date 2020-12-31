/******************************************************************************\
|                                                                              |
|                              account-created-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that is displayed to notify the user that         |
|        their account has been successfully created and is ready to use.      |
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
	'text!templates/users/registration/account-created.tpl',
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
		// event handling methods
		//

		onClickOk: function() {

			// go to welcome view
			//
			application.navigate('#');
		}
	});
});