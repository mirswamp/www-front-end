/******************************************************************************\
|                                                                              |
|                                     version.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract class of models that is a version.           |
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
	'jquery',
	'underscore',
	'models/utilities/timestamped'
], function($, _, Timestamped) {
	return Timestamped.extend({}, {

		//
		// static methods
		//

		comparator: function(versionString) {

			// local utility methods
			//

			function isDigit(char) {
				return (char >= '0' && char <= '9');
			}

			function numLeadingDigits(string) {
				var count = 0;
				for (var i = 0; i < string.length; i++) {
					if (isDigit(string[i])) {
						count++;
					} else {
						break;
					}
				}
				return count;
			}

			function stringToValue(string) {
				var value = 0;
				var placeValue = Math.pow(10, numLeadingDigits(string) - 1);

				// loop through digits from left to right
				//
				for (var i = 0; i < string.length; i++) {
					var char = string[i];
					if (isDigit(char)) {

						// digit is numeric
						//
						value += parseInt(char) * placeValue;
					} else {

						// digit is non-numeric
						//
						value += (string.charCodeAt(i) / 255) * placeValue;
					}

					placeValue /= 10;
				}

				return value;
			}

			// compute sort value
			//
			var versionString = $.trim(versionString);
			var substrings = versionString.split('.');
			var value = 0;
			var placeValue = 1;
			for (var i = 0; i < substrings.length; i++) {
				value += stringToValue(substrings[i]) * placeValue;
				placeValue /= 1000;
			}

			return value;
		},
		
		getNextVersionString: function(versionString) {

			// get initial version string
			//
			if (!versionString) {
				return '1.0';
			}

			// split string by dots
			//
			var substrings = versionString.split('.');

			// increment last version number
			//
			substrings[substrings.length - 1] = parseInt(substrings[substrings.length - 1]) + 1;

			// recombine substrings
			//
			versionString = '';
			for (var i = 0; i < substrings.length; i++) {
				versionString += substrings[i];
				if (i < substrings.length - 1) {
					versionString += '.';
				}
			}

			return versionString;
		}
	});
});