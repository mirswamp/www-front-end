/******************************************************************************\
|                                                                              |
|                                 query-strings.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file contains some javascript utilities that are used to         |
|        deal with URL query strings.                                          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

//
// methods to handle query strings with urls
//

function setQueryString(queryString) {
	if (queryString) {
		window.top.location.href = getWindowBaseLocation() + '?' + queryString;
	} else {
		window.top.location.href = getWindowBaseLocation();
	}
}

function getWindowBaseLocation() {
	var location = window.top.location.href;
	var index = location.indexOf('?');
	if (index != -1) {
		return location.substr(0, index);
	} else {
		return location;
	}
}

function hasQueryString() {
	return getQueryString() != undefined;
}

function getQueryString() {
	return window.top.location.href.split('?')[1];
}

function getQueryStringData() {
	return queryStringToData(getQueryString());
}

function getFragment() {
	var location = window.top.location.href;
	if (location) {
		var strings = location.split('#');
		return strings[1];
	}
}

//
// methods to convert data to and from query strings
//

function toQueryString(data) {
	var queryString = '';
	for (var key in data) {
		var value = data[key];
		var fragment;

		if (typeof value == 'string') {
			fragment = encodeURI(value);
		} else {
			fragment = value.toString();
		}

		queryString = addQueryString(queryString, key + '=' + fragment);
	}
	return queryString;
}

function queryStringToData(queryString) {
	var data = {};
	if (queryString) {
		var substrings = queryString.split('&');
		for (var i = 0; i < substrings.length; i++) {
			var pair = substrings[i].split('=');
			var key = pair[0];
			var value = decodeURIComponent(pair[1]);
			data[key] = value;
		}
	}
	return data;
}

function addQueryString(queryString, newString) {
	if (queryString && queryString != '' && newString && (newString != undefined)) {
		return queryString + '&' + newString;
	} else if (queryString && queryString != '') {
		return queryString;
	} else {
		return newString;
	}
}

function dataToQueryString(data, variables) {
	var queryString = '';
	if (variables == undefined) {
		variables = Object.keys(data);
	}
	for (var i = 0; i < variables.length; i++) {
		var key = variables[i];
		var value = data[key];
		if (value) {
			queryString = addQueryString(queryString, key + '=' + encodeURI(value.toString()));
		}
	}
	return queryString;
}

function arrayToQueryString(name, array) {
	var queryString = '';
	for (var i = 0; i < array.length; i++) {
		queryString += (i > 0? '&' : '') + name + '%5B%5D=' + encodeURI(array[i]);
	}
	return queryString;
}

//
// methods to handle individual query variables
//

function getQueryStringValue(queryString, key) {
	if (!queryString) {
		return undefined;
	}
	
	var vars = queryString.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair[0] == key) {
			return decodeURIComponent(pair[1]);
		}
	}
	
	return undefined;
}

function hasQueryStringValue(queryString, key) {
	return (getQueryStringValue(queryString, key) != undefined);
}

function getQueryStringValues(queryString, keys) {
	var values = {};
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var value = getQueryStringValue(queryString, key);
		if (value) {
			values[key] = value;
		}
	}
	return values;
}