/******************************************************************************\
|                                                                              |
|                       package-dependencies-list-item-view.js                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read only list view of a package's dependencies        |
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
	'text!templates/packages/info/versions/info/build/dependencies/list/package-dependencies-list-item.tpl',
	'views/collections/tables/table-list-item-view'
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				index: this.options.index,
				showNumbering: this.options.showNumbering,
				platformVersionName: this.options.platformVersion? this.options.platformVersion.get('full_name') : '?',
				platformVersionString: this.options.platformVersion? this.options.platformVersion.get('version_string') : '?',
				platformUrl: undefined,
				platformVersionUrl: this.model.has('platform_version_uuid')? application.getURL() + '#platforms/versions/' + this.model.get('platform_version_uuid') : undefined,
				dependencyList: this.model.get('dependency_list')
			};
		}
	});
});