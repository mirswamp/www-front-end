/******************************************************************************\
|                                                                              |
|                            table-list-item-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract view that shows a single list item.          |
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
	'views/collections/lists/list-item-view'
], function($, _, ListItemView) {
	return ListItemView.extend({

		//
		// attributes
		//

		tagName: 'tr'
	});
});