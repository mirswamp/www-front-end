/******************************************************************************\
|                                                                              |
|                                html-utils.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose HTML formatting utilities.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

function stringToHTML(string) {
	if (!string) {
		return;
	}

	// allow strings to break after dashes
	//
	string = string.replace(/-/g, '-<wbr>');

	// allow strings to break after slashes
	//
	string = string.replace(/\//g, '/<wbr>');

	// allow strings to break before dots
	//
	string = string.replace(/\./g, '<wbr>.');

	// allow strings to break before underscores
	//
	string = string.replace(/_/g, '<wbr>_');

	// replace carriage returns
	//
	string = string.replace(/(?:\r\n|\r|\n)/g, '<br />');

	// allow double quotation marks
	//
	string = string.replace(/\"/g, '&#34;');

	// allow single quotation marks
	//
	string = string.replace(/\'/g, '&#39;');

	// allow strings to break at case changes
	//
	string = camelCaseToHTML(string);

	return string;
}

function unquotateHTML(string) {

	if (!string) {
		return;
	}

	// allow double quotation marks
	//
	string = string.replace(/\"/g, '&#34;');

	// allow single quotation marks
	//
	string = string.replace(/\'/g, '&#39;');

	return string;
}

function camelCaseToHTML(string) {
	if (!string) {
		return;
	}

	var substrings = [];
	var i = 0;
	while (i < string.length - 1) {
		var lowercase = /[a-z]/.test(string[i]);
		if (lowercase) {
			var uppercase = /[A-Z]/.test(string[i + 1]);
			if (uppercase) {

				// break at case change
				//
				substrings.push(string.substring(0, i + 1));
				string = string.substring(i + 1, string.length);
				i = 0;
			} else {
				i++;
			}
		} else {
			i++;
		}
	}

	// add remainder of string
	//
	if (substrings.length > 0) {
		substrings.push(string);
	}

	// reassemble string
	//
	if (substrings.length > 0) {
		string = '';
		for (var i = 0; i < substrings.length; i++) {
			string += substrings[i];
			if (i < substrings.length - 1) {
				string += '<wbr>';
			}
		}
	}

	return string;
}

function emailToHTML(email) {
	var html;
	if (email) {
		var substrings = email.split('@');
		if (substrings.length > 1) {
			var user = substrings[0];
			var domain = substrings[1]; 

			html = '<div class="email">';
			html += '<span class="user">' + _.escape(user) + '</span>';
			html += '<span class="domain">' + _.escape(domain) + '</span>';
			html += '</div>';
		} else {
			html = '<div class="email">';
			html += _.escape(email);
			html += '</div>';
		}
	}
	return html;
}