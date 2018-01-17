/******************************************************************************\
|                                                                              |
|                                package-types.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of package types.                      |
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
	'config',
	'models/packages/package-type',
	'collections/utilities/named-items'
], function($, _, Backbone, Config, PackageType, NamedItems) {
	return NamedItems.extend({

		//
		// Backbone attributes
		//

		model: PackageType,
		url: Config.servers.web + '/packages/types',

		//
		// querying methods
		//

		supports: function(packageName) {
			for (var i = 0; i < this.length; i++) {
				var packageType = this.at(i);
				if (packageType.get('name') == packageName && packageType.isEnabled()) {
					return true;
				}
			}
			return false;
		},

		toLanguages: function() {
			var languages = [];

			// get language names
			//
			for (var i = 0; i < this.length; i++) {
				var packageType = this.at(i);
				if (packageType.isEnabled()) {
					var name = packageType.get('name');
					if (name) {
						if (name.contains('C/C++') && !languages.contains('C/C++')) {
							languages.push('C/C++');
						} else if ((name.contains('Java') || name.contains('Android')) && !languages.contains('Java')) {
							languages.push('Java');
						} else if (name.contains('Python') && !languages.contains('Python')) {
							languages.push('Python');
						} else if (name.contains('Ruby') && !languages.contains('Ruby')) {
							languages.push('Ruby');
						} else if (name.contains('Web Scripting')) {
							languages.push('Web Scripting');
						}
					}
				}
			}

			return languages;
		}
	});
});
