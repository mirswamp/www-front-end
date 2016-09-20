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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/widgets/viewers/file-list/file-list.tpl',
	'views/widgets/viewers/file-list/file-list-item-view'
], function($, _, Backbone, Marionette, Template, FileListItemView) {
	return Backbone.Marionette.CompositeView.extend({

		//
		// attributes
		//

		childView: FileListItemView,
		
		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection
			}));
		},

		attachHtml: function(collectionView, childView){
			collectionView.$('tbody').append(childView.el);
		}
	});
});