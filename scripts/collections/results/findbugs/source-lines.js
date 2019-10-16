/******************************************************************************\
|                                                                              |
|                                  source-lines.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of Findbugs results source lines.      |
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
	'models/results/findbugs/source-line',
	'collections/base-collection'
], function($, _, SourceLine, BaseCollection) {
	return BaseCollection.extend({

		//
		// attributes
		//

		model: SourceLine,

		//
		// constructor
		//

		initialize: function(data) {
			var self = this;
			$(data).each(function() {
				self.add(new SourceLine(this));
			});
		}
	});
});