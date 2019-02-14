/******************************************************************************\
|                                                                              |
|                                    file.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a file.                                       |
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
	'backbone'
], function($, _, Backbone) {
	return Backbone.Model.extend({

		//
		// attributes
		//

		defaults: {
			'name': 'untitled'
		}
	});
});