/******************************************************************************\
|                                                                              |
|                                    config.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file is used to parse the JSON configuration information.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'text!../config/config.json',
], function(Config) {

	// parse JSON info
	//
	return JSON.parse(Config);
});