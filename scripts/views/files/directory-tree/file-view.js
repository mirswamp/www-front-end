/******************************************************************************\
|                                                                              |
|                                   file-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a file (usually shown within a         |
|        directory tree.                                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/files/directory-tree/file.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click': 'onClick'
		},

		//
		// methods
		//

		isSelectable: function() {
			return this.options.selectable && this.options.selectable['files'];
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selectable: this.isSelectable(),
				selected: this.options.selected
			}));
		},

		//
		// event handling methods
		//

		onClick: function() {
			if (this.isSelectable()) {

				// deselect any previously selected items in tree
				//
				$('.root.directory').removeClass('selected');
				$('.root.directory').find('.selected').removeClass('selected');

				// select item
				//		
				this.$el.find('.file').addClass('selected');
			}
		}
	});
});