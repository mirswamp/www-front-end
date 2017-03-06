/******************************************************************************\
|                                                                              |
|                                 shared-version.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a version of an object that has sharing attributes.      |
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
	'jquery',
	'underscore',
	'models/utilities/version'
], function($, _, Version) {
	return Version.extend({

		//
		// sharing methods
		//

		isPublic: function() {
			return this.has('version_sharing_status') && 
				this.get('version_sharing_status').toLowerCase() == 'public';
		},

		isPrivate: function() {
			return this.has('version_sharing_status') && 
				this.get('version_sharing_status').toLowerCase() == 'private';
		},

		isProtected: function() {
			return this.has('version_sharing_status') && 
				this.get('version_sharing_status').toLowerCase() == 'protected';
		}
	});
});