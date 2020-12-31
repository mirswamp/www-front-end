/******************************************************************************\
|                                                                              |
|                                file-tree-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for a tree of file items.                         |
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
	'text!templates/widgets/viewers/file-tree/file-tree.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function(data) {
			return {
				model: this.model
			};
		}
	});
});