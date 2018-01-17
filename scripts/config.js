/******************************************************************************\
|                                                                              |
|                                    config.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file is used to parse the JSON configuration information.        |
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
	'text!../config/config.json',
], function(Config) {

	// parse JSON info
	//
	return JSON.parse(Config);
});