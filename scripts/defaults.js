/******************************************************************************\
|                                                                              |
|                                   defaults.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file is used to parse the JSON defaults information.             |
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
	'text!../config/defaults.json',
], function(Defaults) {

	// parse JSON info
	//
	return JSON.parse(Defaults);
});