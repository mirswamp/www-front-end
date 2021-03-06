/******************************************************************************\
|                                                                              |
|                                array-utils.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains some general purpose array handling utilities.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

Array.max = function( array ){
	return Math.max.apply( Math, array );
};

Array.min = function( array ){
	return Math.min.apply( Math, array );
};

Array.prototype.contains = function(item) {
	return Array.prototype.indexOf.call(this, item) != -1;
};

Array.prototype.toCSV = function(array) {
	var string = '';
	for (var i = 0; i < this.length; i++) {
		string += this[i];
		if (i < this.length - 1) {
			string += ', ';
		}
	}
	return string;
};