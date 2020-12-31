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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
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
			var package = this.model.get('package');
			var platform = this.model.get('platform');
			var platformVersion = this.model.get('platform_version');

			return {
				package_name: package.get('name'),
				package_url: package.getAppUrl(),
				platform_name: platform.get('name'),
				platform_url: platform.getAppUrl(),
				platform_version_string: platformVersion.get('version_string'),
				platform_version_url: platformVersion.getAppUrl(),
				showDelete: this.model.isOwned() && this.options.showDelete
			};
		}
	});
});
