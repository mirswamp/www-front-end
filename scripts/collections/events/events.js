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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'models/events/event'
], function($, _, Backbone, Config, Event) {
	return Backbone.Collection.extend({

		//
		// Backbone attributes
		//

		model: Event,
		url: Config.servers.rws + '/events',

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