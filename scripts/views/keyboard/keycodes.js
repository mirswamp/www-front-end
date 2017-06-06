/******************************************************************************\
|                                                                              |
|                                   keycodes.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains various keycodes for useful keyboard keys.              |
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
], function() {
	'use strict';
	
	var codes = {
		'shift': 16,
		'delete': 8,
		'control': 17,
		'alt': 18,
		'command': 91,		// Safari / Chrome
		'cmd': 224			// Firefox
	};

	// add letter char codes
	//
	for (var i = 'a'.charCodeAt(); i <= 'z'.charCodeAt(); i++) {
		codes[String.fromCharCode(i)] = i;
	}
	for (var i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); i++) {
		codes[String.fromCharCode(i)] = i;
	}

	return codes;
});