/******************************************************************************\
|                                                                              |
|                                    version.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file parses the version information from a JSON file.            |
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
	'text!../version.json',
], function(Version) {

	// parse JSON info
	//
	return JSON.parse(Version);
});