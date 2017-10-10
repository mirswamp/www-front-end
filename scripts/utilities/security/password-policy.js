/******************************************************************************\
|                                                                              |
|                                password-policy.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the specific password strength policy used in            |
|        this application.                                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

var passwordPolicy = "Passwords must be at least 10 characters long and include at least three of the following character types: uppercase, lowercase, number, or symbol. Common and simple passwords will be rejected. Maximum length is 200 characters (additional characters will be truncated). Characters outside of the ASCII range of 32 to 126 are not allowed.";

define([
	'jquery',
	'underscore',
	'backbone',
	'jquery.validate.bootstrap',
], function($, _, Backbone, Validate) {

	//
	// character regular expressions
	//

	var LOWER = /[a-z]/,
		UPPER = /[A-Z]/,
		DIGIT = /[0-9]/,
		SPECIAL = /[-~`!@#$%^&*()_+=|\\\[\]{ }?/.,<>;:'"]/;

	//
	// password policy testing methods
	//

	function rating(rate, message) {
		return {
			rate: rate,
			messageKey: message
		};
	}

	function containsInvalidChars(string) {
		for (var i = 0; i < string.length; i++) {
			var ch = string[i];
			if (!LOWER.test(ch) && !UPPER.test(ch) && !DIGIT.test(ch) && !SPECIAL.test(ch)) {
				return true;
			}
		}
		return false;
	}
	
	$.validator.passwordRating = function(password, username) {

		// case 1: password too short
		//
		if (!password || password.length < 10) {
			return rating(0, "too-short");
		}

		// case 2: password too similar to username
		//
		if (username && password.toLowerCase().match(username.toLowerCase())) {
			return rating(0, "too-similar-to-username");
		}
		
		// case 3: invalid characters
		//
		if (containsInvalidChars(password)) {
			return rating(1, "invalid")
		}

		// case 4: insufficient mix of characters
		//
		var numTypes = 0;
		if (LOWER.test(password)) {
			numTypes++;
		}
		if (UPPER.test(password)) {
			numTypes++;
		}
		if (DIGIT.test(password)) {
			numTypes++;
		}
		if (SPECIAL.test(password)) {
			numTypes++;
		}
		if (numTypes < 3) {
			return rating(1, "insufficient")
		}

		// case 5: passed!
		//
		return rating(3, "strong");
	}

	$.validator.passwordRating.messages = {
		"too-short": "Too short",
		"too-similar-to-username": "Too similar to username",
		"invalid": "Contains invalid characters",
		"insufficient": "Contains an insufficient mix of characters",
		"strong": "Strong"
	}
});
