/******************************************************************************\
|                                                                              |
|                                 linked-account.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model for linked user accounts for users who have      |
|        created accounts using federated authentication.                      |
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
	'config',
	'models/base-model'
], function($, _, Config, BaseModel) {
	return BaseModel.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'linked_account_id',
		urlRoot: Config.servers.web + '/linked-accounts',

		//
		// ajax methods
		//

		setEnabled: function(enabled, options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/linked-accounts/' + this.get('linked_account_id') + '/enabled',
				type: 'POST',
				data: {
					enabled_flag: enabled
				},
			}));
		}
	});
});