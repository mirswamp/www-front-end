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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'models/base-model'
], function($, _, BaseModel) {
	return BaseModel.extend({

		//
		// attributes
		//

		defaults: {
			'name': 'untitled'
		}
	});
});