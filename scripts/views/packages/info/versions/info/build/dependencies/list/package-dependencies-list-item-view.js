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
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/packages/info/versions/info/build/dependencies/list/package-dependencies-list-item.tpl'
], function($, _, Backbone, Marionette, Registry, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				index: this.options.index,
				showNumbering: this.options.showNumbering,
				platformVersionName: this.options.platformVersion? this.options.platformVersion.get('full_name') : '?',
				platformVersionString: this.options.platformVersion? this.options.platformVersion.get('version_string') : '?',
				platformUrl: undefined,
				platformVersionUrl: data.platform_version_uuid? Registry.application.getURL() + '#platforms/versions/' + data.platform_version_uuid : undefined,
				dependencyList: this.model.get('dependency_list')
			}));
		}
	});
});