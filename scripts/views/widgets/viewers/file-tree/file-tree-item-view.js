/******************************************************************************\
|                                                                              |
|                            file-tree-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for a single item in a file tree.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/widgets/viewers/file-tree/file.tpl',
	'views/collections/collection-view'
], function($, _, Template, DirectoryTemplate, CollectionView) {
	return CollectionView.extend({

		//
		// attributes
		//

		tagName: 'li',

		template: _.template(Template),

		//
		// constructor
		//

		initialize: function() {
			if (this.model.has('contents')) {
				this.collection = new Backbone.Collection(this.model.get('contents'));
			}
		},
		
		//
		// rendering methods
		//

		attachHtml: function(collectionView, childView){
			collectionView.$('li:first').append(childView.el);
		}
	});
});