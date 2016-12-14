/******************************************************************************\
|                                                                              |
|                                browser-support.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for detection whether or not a browser        |
|        supports certain features.                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

function browserSupportsCors() {
	var supportsCors;
	if ("withCredentials" in new XMLHttpRequest()) {
		supportsCors = true;	
	} else if (window.XDomainRequest) {
		supportsCors = true;
	} else {
		supportsCors = false;
	}
	return supportsCors;
}

function browserSupportsHTTPRequestUploads() {
	return window.XMLHttpRequest && ('upload' in new XMLHttpRequest());
}

function browserSupportsFormData() {
	return (window.FormData !== null);
}