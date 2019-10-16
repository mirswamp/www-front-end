/******************************************************************************\
|                                                                              |
|                           tools-list-item-view.js                            |
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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/tools/list/tools-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-format'
], function($, _, Template, TableListItemView, DateFormat) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			var showToolDetails = application.session.user && 
				(this.model.isPublic() || this.model.isOwned);

			return {
				model: this.model,
				index: this.options.index + 1,
				url: showToolDetails? '#tools/' + this.model.get('tool_uuid'): undefined,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering,
				showDeactivatedPackages: this.options.showDeactivatedPackages
			};
		}
	});
});
