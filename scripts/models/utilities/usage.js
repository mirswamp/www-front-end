/******************************************************************************\
|                                                                              |
|                                     usage.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract class of models that is a version.           |
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
	return BaseModel.extend({}, {

		//
		// ajax methods
		//

		fetch: function(options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/usage/' + (options.which || 'latest'),
				type: 'GET'
			}));
		}
	});
});