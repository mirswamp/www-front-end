/******************************************************************************\
|                                                                              |
|                                   policy.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a policy.                                     |
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

		idAttribute: 'policy_code',
		urlRoot: Config.servers.web + '/policies'
	});
});
