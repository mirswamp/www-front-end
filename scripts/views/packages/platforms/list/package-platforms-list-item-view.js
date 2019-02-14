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
	'backbone',
	'marionette',
	'text!templates/packages/platforms/list/package-platforms-list-item.tpl',
	'registry',
	'views/dialogs/confirm-view',
], function($, _, Backbone, Marionette, Template, Registry, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				index: this.options.index + 1,
				package_url: Registry.application.session.user? '#packages/' + data.package.get('package_uuid'): undefined,
				platform_url: null,
				platform_version_url: null,
				showDelete: this.options.showDelete,
				showNumbering: this.options.showNumbering
			}));
		}
	});
});
