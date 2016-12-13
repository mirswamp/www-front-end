/******************************************************************************\
|                                                                              |
|                                 string-utils.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose string formatting utilities.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

String.prototype.toTitleCase = function () {
	return this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

String.prototype.capitalize = function(){
	return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2) {
		return p1+p2.toUpperCase();
	});
};

String.prototype.startsWith = function(prefix) {
	var from = 0;
	var to = prefix.length;
	return prefix == this.substring(from, to);
}

String.prototype.endsWith = function(suffix) {
	var from = this.length - suffix.length;
	var to = this.length;
	return suffix == this.substring(from, to);
}

String.prototype.contains = function(substring) {
	return this.indexOf(substring) != -1;
};

String.prototype.truncatedTo = function(maxChars) {
	if (this.length > maxChars) {
		return this.slice(0, maxChars) + '...';
	} else {
		return this;
	}
};