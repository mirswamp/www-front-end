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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/widgets/viewers/file-tree/file.tpl',
], function($, _, Backbone, Marionette, FileTemplate, DirectoryTemplate) {
	return Backbone.Marionette.CompositeView.extend({

		//
		// attributes
		//

		tagName: 'li',

		//
		// methods
		//

		initialize: function() {
			if (this.model.has('contents')) {
				this.collection = new Backbone.Collection(this.model.get('contents'));
			}
		},
		
		//
		// rendering methods
		//

		template: function(data) {
			return _.template(FileTemplate, data);
		},

		attachHtml: function(collectionView, childView){
			collectionView.$('li:first').append(childView.el);
		}
	});
});