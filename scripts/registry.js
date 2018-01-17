/******************************************************************************\
|                                                                              |
|                                 registry.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This registry provides a way to share information across the          |
|        application.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
], function() {

	return {

		//
		// methods
		//

		addKey: function(key, value) {
			this[key] = value;
		},

		removeKey: function(key) {
			delete this[key];
		}
	};
});

