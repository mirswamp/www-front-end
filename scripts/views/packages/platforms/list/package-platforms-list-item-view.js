/******************************************************************************\
|                                                                              |
|                        package-platforms-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of package platforms.                                          |
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
	'text!templates/packages/platforms/list/package-platforms-list-item.tpl',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				index: this.options.index + 1,
				package_url: application.session.user? '#packages/' + data.package.get('package_uuid'): undefined,
				platform_url: null,
				platform_version_url: null,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering
			};
		}
	});
});
