/******************************************************************************\
|                                                                              |
|                                    versions.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of package versions.                   |
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
	'backbone',
	'models/utilities/version',
	'collections/base-collection'
], function($, _, Backbone, Version, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Version,

		//
		// sorting methods
		//

		sort: function(options) {

			// sort by version string
			//
			this.sortByAttribute('version_string', _.extend(options || {}, {
				comparator: function(versionString) {
					return Version.comparator(versionString);
				}
			}));
		},

		sorted: function(options) {

			// sort by version string
			//
			return this.sortedByAttribute('version_string', _.extend(options || {}, {
				comparator: function(versionString) {
					return Version.comparator(versionString);
				}		
			}));
		}
	});
});
