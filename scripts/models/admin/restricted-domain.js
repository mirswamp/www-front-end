/******************************************************************************\
|                                                                              |
|                               restricted-domain.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an instance of a restricted domain, which may            |
|        not be used for user email verifiation.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/utilities/timestamped'
], function($, _, Config, Timestamped) {
	return Timestamped.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'restricted_domain_id',
		urlRoot: Config.servers.web + '/restricted-domains'
	});
});
