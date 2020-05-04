/******************************************************************************\
|                                                                              |
|                                weaknesses.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of virtual machine platforms.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'collections/base-collection'
], function($, _, BaseCollection) {
	return BaseCollection.extend({

		//
		// sorting
		//

		comparator: function(item) {
			return item.get('BugLocations')[0].StartLine;
		}
	});
});