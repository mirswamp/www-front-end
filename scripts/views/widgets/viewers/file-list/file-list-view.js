/******************************************************************************\
|                                                                              |
|                                file-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for a list of file items.                         |
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
	'text!templates/widgets/viewers/file-list/file-list.tpl',
	'views/collections/collection-view',
	'views/widgets/viewers/file-list/file-list-item-view'
], function($, _, Template, CollectionView, FileListItemView) {
	return CollectionView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: FileListItemView,
		
		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection
			};
		},

		attachHtml: function(collectionView, childView){
			collectionView.$('tbody').append(childView.el);
		}
	});
});