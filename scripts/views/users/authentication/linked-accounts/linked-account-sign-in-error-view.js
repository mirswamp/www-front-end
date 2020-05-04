/******************************************************************************\
|                                                                              |
|                     linked-account-sign-in-error-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view shows error information in the event of a linked            |
|        account error.                                                        |
|                                                                              |
|******************************************************************************|
|          Copyright (C) 2012 - 2020, Morgridge Institute for Research         |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/users/authentication/linked-accounts/linked-account-sign-in-error.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	'use strict';
	
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
				provider: this.options.provider,
				type: this.options.type
			};
		}
	});
});
