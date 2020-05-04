/******************************************************************************\
|                                                                              |
|                                app-password.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model for describing application passwords.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
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

		idAttribute: 'app_password_uuid',
		urlRoot: Config.servers.web + '/v1/app_passwords'
	});
});