/******************************************************************************\
|                                                                              |
|                                  table-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view for displaying a generic list.          |
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
	'marionette',
	'views/widgets/lists/list-view'
], function($, _, Backbone, Marionette, ListView) {
	return ListView.extend({

		//
		// rendering methods
		//

		attachHtml: function(collectionView, childView) {
			collectionView.$('tbody').append(childView.el);
		}
	});
});