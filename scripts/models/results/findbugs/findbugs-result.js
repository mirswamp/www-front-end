/******************************************************************************\
|                                                                              |
|                                findbugs-result.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a Findbugs assessment result.                 |
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
	'backbone'
], function($, _, Backbone) {
	return Backbone.Model.extend({

		//
		// overridden Backbone methods
		//

		initialize: function(attributes, options) {
			this.set({
				'type': $(options.data).attr('type'),
				'category': $(options.data).attr('category'),
				'abbrev': $(options.data).attr('abbrev'),
				'priority': $(options.data).attr('priority')
			});
		}
	});
});