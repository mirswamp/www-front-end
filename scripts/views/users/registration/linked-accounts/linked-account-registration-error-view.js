/******************************************************************************\
|                                                                              |
|                   linked-account-registration-error-view.js                  |
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
	'text!templates/users/registration/linked-accounts/linked-account-registration-error.tpl',
	'views/base-view',
	'utilities/web/query-strings'
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
			if (this.options.provider == 'cilogon') {
				this.options.provider = getQueryStringValue('entityid');
			}
			return {
				provider: this.options.provider? this.options.provider.toTitleCase() : '?',
				type: this.options.type
			};
		}
	});
});
