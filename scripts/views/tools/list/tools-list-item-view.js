/******************************************************************************\
|                                                                              |
|                                tools-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of tools.                                                      |
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
	'text!templates/tools/list/tools-list-item.tpl',
	'registry',
	'utilities/time/date-format'
], function($, _, Backbone, Marionette, Template, Registry, DateFormat) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			var showToolDetails = Registry.application.session.user && 
				(this.model.isPublic() || this.model.isOwned);

			return _.template(Template, _.extend(data, {
				model: this.model,
				index: this.options.index + 1,
				url: showToolDetails? '#tools/' + this.model.get('tool_uuid'): undefined,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering,
				showDeactivatedPackages: this.options.showDeactivatedPackages
			}));
		}
	});
});
