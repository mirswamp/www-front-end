/******************************************************************************\
|                                                                              |
|                                   html-utils.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose HTML formatting utilities.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

function textToHtml(string) {

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

	// allow strings to break after slashes
	//
	if (string) {
		string = string.replace(/\//g, '/<wbr>');
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
			for (var j = 0; j < substrings.length; j++) {
				string += substrings[j];
				if (j < substrings.length - 1) {
					string += '<wbr>';
				}
			}
		}
	}

	return string;
}

function htmlToText(html) {
	html = html.replace(/<br>/g, '\n');
	var tmp = document.createElement('div');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function htmlEncode(string) {
	return string.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
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