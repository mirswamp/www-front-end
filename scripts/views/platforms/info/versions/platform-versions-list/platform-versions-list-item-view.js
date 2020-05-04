/******************************************************************************\
|                                                                              |
|                        platform-versions-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a platform versions list item.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/platforms/info/versions/platform-versions-list/platform-versions-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
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
				model: this.model,
				url: application.session.user? application.getURL() + '#platforms/versions/' + this.model.get('platform_version_uuid') : undefined,
				showDelete: false
			};
		}
	});
});