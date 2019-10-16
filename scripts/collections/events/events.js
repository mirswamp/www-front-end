/******************************************************************************\
|                                                                              |
|                                    events.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of generic events.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'config',
	'models/events/event',
	'collections/base-collection'
], function($, _, Config, Event, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: Event,
		url: Config.servers.web + '/events',

		//
		// overridden Backbone methods
		//

		comparator: function(model) {

			// reverse chronological order
			//
			if (model.has('date')) {
				return -model.get('date').getTime();
			}
		}
	});
});