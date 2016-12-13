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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

function stringToHTML(string) {

	// provide escaping for HTML special chars
	//
	string = _.escape(string);

	// allow strings to break before dashes
	//
	if (string) {
		string = string.replace(/-/g, '<wbr>-<wbr>');
	}

	// allow strings to break before dots
	//
	if (string) {
		string = string.replace(/\./g, '<wbr>.<wbr>');
	}

	// allow strings to break before underscores
	//
	if (string) {
		string = string.replace(/_/g, '<wbr>_<wbr>');
	}

	// allow strings to break at case changes
	//
	if (string) {
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
	}

	return string;
}

function emailToHTML(email) {
	if (email) {
		var substrings = email.split('@');
		if (substrings.length > 1) {
			var user = substrings[0];
			var domain = substrings[1]; 

			var html = '<div class="email">';
			html += '<span class="user">' + _.escape(user); + '</span>';
			html += '<span class="domain">' + _.escape(domain) + '</span>';
			html += '</div>';
			return html;
		} else {
			var html = '<div class="email">';
			html += _.escape(email);
			html += '</div>';
			return html;
		}
	}
}