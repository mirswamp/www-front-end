/******************************************************************************\
|                                                                              |
|                               findbugs-results.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of Findbugs results.                   |
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
	'models/results/findbugs/findbugs-result'
], function($, _, Backbone, FindBugsResult) {
	return Backbone.Collection.extend({

		//
		// overridden Backbone attributes
		//

		initialize: function(models, options) {
			var self = this;
			$(options.data).find('BugInstance').each(function() {
				self.add(new FindBugsResult(null, {
					data: this
				}));
			});
		}
	});
});